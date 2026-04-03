/**
 * API Route: /api/notifications
 * Combined notification endpoints
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { notificationService } from '../services/notificationService.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  const { action } = req.query;

  // POST /api/notifications?action=subscribe
  if (action === 'subscribe') {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { email, phone, preferences } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const subscribersPath = join(__dirname, '../../data/subscribers.json');
      let subscribers = [];
      try {
        subscribers = JSON.parse(readFileSync(subscribersPath, 'utf8'));
      } catch {
        subscribers = [];
      }

      if (subscribers.some(s => s.email === email)) {
        return res.status(409).json({ error: 'Already subscribed' });
      }

      subscribers.push({
        email,
        phone,
        preferences: {
          deadlineAlerts: true,
          bidOpeningReminders: true,
          newTenderAlerts: true,
          resultUpdates: true,
          ...preferences
        },
        subscribedAt: new Date().toISOString()
      });

      writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));

      return res.status(201).json({
        success: true,
        message: 'Subscribed successfully'
      });
    } catch (error) {
      console.error('Error subscribing:', error);
      return res.status(500).json({ error: 'Failed to subscribe' });
    }
  }

  // POST /api/notifications?action=unsubscribe
  if (action === 'unsubscribe') {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const subscribersPath = join(__dirname, '../../data/subscribers.json');
      let subscribers = [];
      try {
        subscribers = JSON.parse(readFileSync(subscribersPath, 'utf8'));
      } catch {
        subscribers = [];
      }

      const filtered = subscribers.filter(s => s.email !== email);

      if (filtered.length === subscribers.length) {
        return res.status(404).json({ error: 'Email not found' });
      }

      writeFileSync(subscribersPath, JSON.stringify(filtered, null, 2));

      return res.status(200).json({
        success: true,
        message: 'Unsubscribed successfully'
      });
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return res.status(500).json({ error: 'Failed to unsubscribe' });
    }
  }

  // POST /api/notifications?action=new-bid
  if (action === 'new-bid') {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const bid = req.body;

      if (!bid || !bid.title) {
        return res.status(400).json({ error: 'Bid data with title is required' });
      }

      const subscribersPath = join(__dirname, '../../data/subscribers.json');
      let subscribers = [];
      try {
        subscribers = JSON.parse(readFileSync(subscribersPath, 'utf8'));
      } catch {
        subscribers = [];
      }

      subscribers.forEach((sub, index) => {
        notificationService.addSubscriber(`sub-${index}`, {
          email: sub.email,
          phone: sub.phone,
          preferences: sub.preferences
        });
      });

      await notificationService.sendNewBidAlert(bid);

      return res.status(200).json({
        success: true,
        message: `New bid notification sent to ${subscribers.length} subscriber(s)`,
        subscribersCount: subscribers.length
      });
    } catch (error) {
      console.error('Error sending new bid notification:', error);
      return res.status(500).json({ error: 'Failed to send notification' });
    }
  }

  return res.status(400).json({ error: 'Invalid action. Use ?action=subscribe|unsubscribe|new-bid' });
}
