const cron = require('node-cron');
const User = require('../models/User');
const { sendAlertEmail } = require('../utils/email');

const INACTIVE_DAYS = parseInt(process.env.INACTIVE_DAYS || '30');

const startInactiveCheck = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('[Cron] Running inactive user check...');
    try {
      const threshold = new Date();
      threshold.setDate(threshold.getDate() - INACTIVE_DAYS);

      // Find users inactive for 30+ days who have emergency contact and alert not sent yet
      const inactiveUsers = await User.find({
        lastActive: { $lt: threshold },
        emergencyContact: { $ne: '' },
        inactiveAlertSent: false
      });

      for (const user of inactiveUsers) {
        const daysSince = Math.floor((Date.now() - new Date(user.lastActive)) / 86400000);

        // Send alert to emergency contact
        await sendAlertEmail(
          user.emergencyContact,
          `
          <h3 style="color:#d4a017">SafeVault — Inactive Account Alert</h3>
          <p>Hi,</p>
          <p>This is an automated safety alert from SafeVault.</p>
          <p>The SafeVault account belonging to <strong>${user.name}</strong> 
          (<code>${user.email}</code>) has not been accessed for 
          <strong>${daysSince} days</strong>.</p>
          <p>If this is unexpected, please check on them.</p>
          <p>Last login: <strong>${new Date(user.lastActive).toDateString()}</strong></p>
          <br/>
          <p style="font-size:12px;color:#888">This alert was sent because this email was set as the emergency contact for that account.</p>
          `,
          `SafeVault: ${user.name} hasn't logged in for ${daysSince} days`
        );

        // Mark alert as sent so it doesn't repeat every day
        user.inactiveAlertSent = true;
        await user.save();

        console.log(`[Cron] Alert sent to emergency contact: ${user.emergencyContact} for user: ${user.email}`);
      }

      if (inactiveUsers.length === 0) {
        console.log('[Cron] No inactive users found.');
      }
    } catch (err) {
      console.error('[Cron] Inactive check error:', err.message);
    }
  });

  console.log('[Cron] Inactive user check scheduler started (runs daily at 9 AM)');
};

module.exports = { startInactiveCheck };
