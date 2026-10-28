/**
 * ML Integration Module for OSINT Phone Number Correlation
 * 
 * This module provides integration points for machine learning enhancements
 * to the phone number correlation system.
 */

import { phonePatternModel } from './phonePatternModel.js';

// Initialize the ML model when the module loads
async function initializeML() {
  try {
    await phonePatternModel.loadWeights();
    console.log('[ML Integration] Phone pattern model loaded');
  } catch (error) {
    console.warn('[ML Integration] Failed to load model weights:', error);
  }
  
  // Initialize the model if not already done
  if (!phonePatternModel.isInitialized) {
    await phonePatternModel.initialize();
  }
}

// Call initialization
initializeML();

/**
 * Enhanced correlation function with ML enhancement
 * @param {string} phoneNumber - Phone number to correlate
 * @param {string} caseId - Case ID for correlation
 * @returns {Promise<Object>} Enhanced correlation result
 */
export async function enhancedCorrelatePhoneWithCase(phoneNumber, caseId) {
  try {
    // Get the basic phone OSINT data
    const osintData = await correlatePhoneWithCase(phoneNumber, caseId);
    
    if (!osintData.parsed.isValid) {
      return osintData;
    }
    
    // Find matching annotations in the case
    const matches = await findPhoneMatchesInCase(phoneNumber, caseId);
    
    // Get carrier information
    const carrierInfo = await getCarrierInfo(phoneNumber);
    
    // Apply ML enhancement to match confidence
    const enhancedMatches = [];
    for (const match of matches) {
      // Use ML model to predict match probability
      const matchProbability = await phonePatternModel.predictMatch(phoneNumber, match.annotationData);
      
      enhancedMatches.push({
        ...match,
        confidence: matchProbability,
        enhanced: true
      });
    }
    
    // Add correlation data to result
    return {
      ...osintData,
      carrier: carrierInfo,
      annotationMatches: enhancedMatches,
      correlation: {
        caseId,
        status: 'resolved',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('[ML Integration] Enhanced correlation error:', error);
    // Fallback to standard correlation on ML failure
    return await correlatePhoneWithCase(phoneNumber, caseId);
  }
}

/**
 * Train the ML model with new data
 * @param {Array} trainingData - Array of [phoneNumber, annotationData, label] tuples
 */
export async function trainPatternModel(trainingData) {
  try {
    await phonePatternModel.train(trainingData);
    await phonePatternModel.saveWeights();
    console.log('[ML Integration] Model trained and weights saved');
  } catch (error) {
    console.error('[ML Integration] Training error:', error);
  }
}

// Export functions for use in other modules
export { phonePatternModel };

// Import required functions from existing modules
import { correlatePhoneWithCase, findPhoneMatchesInCase, getCarrierInfo } from '../osint/phone.js';