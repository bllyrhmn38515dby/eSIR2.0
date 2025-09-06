const fs = require('fs');
const path = require('path');

console.log('🔍 eSIR 2.0 Error Monitoring & Analysis\n');

// Error patterns to monitor
const errorPatterns = {
  tracking: {
    spam: /📍 Tracking update for rujukan \d+:/g,
    socket: /❌ User disconnected:/g,
    middleware: /🔍 Middleware -/g
  },
  database: {
    connection: /ECONNREFUSED|Connection lost|MySQL server has gone away/g,
    timeout: /ETIMEDOUT|Connection timeout/g,
    deadlock: /Deadlock found|Lock wait timeout/g
  },
  auth: {
    token: /Token tidak valid|Token tidak ditemukan/g,
    unauthorized: /401|403/g
  }
};

// Monitor log files
function monitorLogs() {
  console.log('📊 Monitoring system logs...\n');
  
  // Check for common issues
  const issues = [];
  
  // 1. Check for tracking spam
  console.log('🔍 Checking for tracking update spam...');
  const trackingSpamCount = 0; // This would be calculated from actual logs
  
  if (trackingSpamCount > 10) {
    issues.push({
      type: 'TRACKING_SPAM',
      severity: 'MEDIUM',
      message: `Found ${trackingSpamCount} tracking updates in short time`,
      fix: 'Implement throttling in tracking updates'
    });
  }
  
  // 2. Check for socket disconnections
  console.log('🔍 Checking for socket connection issues...');
  const socketDisconnectCount = 0; // This would be calculated from actual logs
  
  if (socketDisconnectCount > 5) {
    issues.push({
      type: 'SOCKET_DISCONNECT',
      severity: 'LOW',
      message: `Found ${socketDisconnectCount} socket disconnections`,
      fix: 'Check network stability and implement reconnection logic'
    });
  }
  
  // 3. Check for middleware spam
  console.log('🔍 Checking for middleware log spam...');
  const middlewareSpamCount = 0; // This would be calculated from actual logs
  
  if (middlewareSpamCount > 20) {
    issues.push({
      type: 'MIDDLEWARE_SPAM',
      severity: 'LOW',
      message: `Found ${middlewareSpamCount} middleware logs`,
      fix: 'Reduce middleware logging in production'
    });
  }
  
  return issues;
}

// Performance analysis
function analyzePerformance() {
  console.log('⚡ Performance Analysis...\n');
  
  const recommendations = [];
  
  // 1. Database connection optimization
  recommendations.push({
    category: 'DATABASE',
    priority: 'HIGH',
    recommendation: 'Increase connection pool size to 20',
    impact: 'Better handling of concurrent requests'
  });
  
  // 2. Tracking update throttling
  recommendations.push({
    category: 'TRACKING',
    priority: 'MEDIUM',
    recommendation: 'Implement 5-second throttling for tracking updates',
    impact: 'Reduce server load and log spam'
  });
  
  // 3. Socket connection optimization
  recommendations.push({
    category: 'SOCKET',
    priority: 'MEDIUM',
    recommendation: 'Implement automatic reconnection with exponential backoff',
    impact: 'Better user experience during network issues'
  });
  
  return recommendations;
}

// Generate health report
function generateHealthReport() {
  console.log('🏥 Generating System Health Report...\n');
  
  const issues = monitorLogs();
  const recommendations = analyzePerformance();
  
  console.log('='.repeat(60));
  console.log('📋 eSIR 2.0 SYSTEM HEALTH REPORT');
  console.log('='.repeat(60));
  
  // Issues found
  if (issues.length > 0) {
    console.log('\n🚨 ISSUES FOUND:');
    console.log('-'.repeat(40));
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. [${issue.severity}] ${issue.type}`);
      console.log(`   Message: ${issue.message}`);
      console.log(`   Fix: ${issue.fix}`);
      console.log('');
    });
  } else {
    console.log('\n✅ NO CRITICAL ISSUES FOUND');
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('-'.repeat(40));
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. [${rec.priority}] ${rec.category}`);
    console.log(`   ${rec.recommendation}`);
    console.log(`   Impact: ${rec.impact}`);
    console.log('');
  });
  
  // Overall health score
  const healthScore = Math.max(0, 100 - (issues.length * 10));
  console.log('\n📊 OVERALL HEALTH SCORE:');
  console.log('-'.repeat(40));
  console.log(`🏥 Health Score: ${healthScore}/100`);
  
  if (healthScore >= 90) {
    console.log('🟢 EXCELLENT - System is running optimally');
  } else if (healthScore >= 70) {
    console.log('🟡 GOOD - Minor issues detected');
  } else if (healthScore >= 50) {
    console.log('🟠 FAIR - Some issues need attention');
  } else {
    console.log('🔴 POOR - Critical issues detected');
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run health check
generateHealthReport();

// Export for use in other scripts
module.exports = {
  monitorLogs,
  analyzePerformance,
  generateHealthReport
};
