// Daily Email Automation Script
// This script should be run as a cron job to automatically send daily schedule emails

const axios = require('axios');
const cron = require('node-cron');

// Configuration
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const CRON_API_KEY = process.env.CRON_API_KEY || 'btacademy-cron-2024';

// Default schedule times
const STUDENT_EMAIL_TIME = process.env.STUDENT_EMAIL_TIME || '7:00'; // 7:00 AM
const ADMIN_EMAIL_TIME = process.env.ADMIN_EMAIL_TIME || '7:01';     // 8:00 AM

class DailyEmailAutomation {
  constructor() {
    this.sessionToken = null;
    this.isRunning = false;
  }

  // No authentication needed - using API key
  async authenticate() {
    console.log('✅ Using API key authentication');
    return true;
  }

  // Send daily schedule emails to students
  async sendStudentEmails() {
    try {
      console.log('📧 Sending daily schedule emails to students...');
      
      const today = new Date().toISOString().split('T')[0];
      
      const response = await axios.post(
        `${BASE_URL}/api/cron/send-daily-emails`,
        {
          date: today,
          type: 'student',
          apiKey: CRON_API_KEY
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': CRON_API_KEY
          },
        }
      );

      if (response.data.success) {
        console.log('✅ Student emails sent successfully:', response.data.message);
        console.log('📊 Stats:', response.data.data);
      } else {
        console.error('❌ Failed to send student emails:', response.data.message);
      }
    } catch (error) {
      console.error('❌ Error sending student emails:', error.response?.data?.message || error.message);
    }
  }

  // Send daily schedule emails to admins
  async sendAdminEmails() {
    try {
      console.log('📧 Sending daily schedule emails to admins...');
      
      const today = new Date().toISOString().split('T')[0];
      
      const response = await axios.post(
        `${BASE_URL}/api/cron/send-daily-emails`,
        {
          date: today,
          type: 'admin',
          apiKey: CRON_API_KEY
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': CRON_API_KEY
          },
        }
      );

      if (response.data.success) {
        console.log('✅ Admin emails sent successfully:', response.data.message);
        console.log('📊 Stats:', response.data.data);
      } else {
        console.error('❌ Failed to send admin emails:', response.data.message);
      }
    } catch (error) {
      console.error('❌ Error sending admin emails:', error.response?.data?.message || error.message);
    }
  }

  // Main execution function
  async run(type = 'student') {
    if (this.isRunning) {
      console.log('⏳ Email automation is already running, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = new Date();
    console.log(`🚀 Starting daily email automation (${type}) at ${startTime.toLocaleString()}`);

    try {
      // Simple authentication check
      await this.authenticate();

      // Send emails based on type
      if (type === 'student') {
        await this.sendStudentEmails();
      } else if (type === 'admin') {
        await this.sendAdminEmails();
      } else if (type === 'both') {
        await this.sendStudentEmails();
        await this.sendAdminEmails();
      }

      const endTime = new Date();
      const duration = (endTime - startTime) / 1000;
      console.log(`✅ Daily email automation completed in ${duration}s`);

    } catch (error) {
      console.error('❌ Unexpected error in email automation:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Setup cron jobs
  setupCronJobs() {
    console.log('⚙️ Setting up cron jobs...');

    // Student emails - every day at specified time
    const studentCronExpression = this.timeToCron(STUDENT_EMAIL_TIME);
    cron.schedule(studentCronExpression, () => {
      console.log('⏰ Student email cron job triggered');
      this.run('student');
    }, {
      timezone: "Asia/Ho_Chi_Minh"
    });

    // Admin emails - every day at specified time
    const adminCronExpression = this.timeToCron(ADMIN_EMAIL_TIME);
    cron.schedule(adminCronExpression, () => {
      console.log('⏰ Admin email cron job triggered');
      this.run('admin');
    }, {
      timezone: "Asia/Ho_Chi_Minh"
    });

    console.log(`✅ Cron jobs scheduled:`);
    console.log(`   📧 Student emails: ${STUDENT_EMAIL_TIME} (${studentCronExpression})`);
    console.log(`   📧 Admin emails: ${ADMIN_EMAIL_TIME} (${adminCronExpression})`);
  }

  // Convert time (HH:MM) to cron expression
  timeToCron(time) {
    const [hours, minutes] = time.split(':');
    return `${minutes} ${hours} * * *`; // Every day at HH:MM
  }

  // Manual trigger for testing
  async testRun(type = 'student') {
    console.log(`🧪 Running test email automation (${type})...`);
    await this.run(type);
  }
}

// Initialize the automation system
const emailAutomation = new DailyEmailAutomation();

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'test-student') {
  emailAutomation.testRun('student');
} else if (command === 'test-admin') {
  emailAutomation.testRun('admin');
} else if (command === 'test-both') {
  emailAutomation.testRun('both');
} else if (command === 'setup') {
  emailAutomation.setupCronJobs();
  console.log('🔄 Cron jobs are running. Press Ctrl+C to stop.');
} else {
  console.log('📋 Daily Email Automation Commands:');
  console.log('   npm run email-cron setup     - Setup and run cron jobs');
  console.log('   npm run email-cron test-student  - Test student emails');
  console.log('   npm run email-cron test-admin    - Test admin emails');
  console.log('   npm run email-cron test-both     - Test both emails');
  console.log('');
  console.log('📝 Environment variables needed:');
  console.log('   NEXTAUTH_URL - Base URL of the application');
  console.log('   CRON_API_KEY - API key for cron authentication (default: btacademy-cron-2024)');
  console.log('   STUDENT_EMAIL_TIME - Time to send student emails (default: 07:00)');
  console.log('   ADMIN_EMAIL_TIME - Time to send admin emails (default: 08:00)');
}

// Export for use in other modules
module.exports = DailyEmailAutomation;
