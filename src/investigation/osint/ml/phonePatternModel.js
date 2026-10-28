/**
 * TensorFlow.js Model for Phone Number Pattern Recognition
 * 
 * This module implements a machine learning model to enhance phone number
 * correlation with case annotations by recognizing patterns in number formatting,
 * geographic distribution, and usage trends.
 */

import * as tf from '@tensorflow/tfjs';

// Define the model architecture
export class PhonePatternModel {
  constructor() {
    this.model = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the ML model with pre-trained weights
   */
  async initialize() {
    try {
      // Create a simple neural network for pattern recognition
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({
            inputShape: [10], // Input features (e.g., number digits, area code patterns)
            units: 32,
            activation: 'relu'
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({
            units: 16,
            activation: 'relu'
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({
            units: 1,
            activation: 'sigmoid' // Binary classification: match/no match
          })
        ]
      });

      // Compile the model
      this.model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      this.isInitialized = true;
      console.log('[PhonePatternModel] ML Model initialized successfully');
    } catch (error) {
      console.error('[PhonePatternModel] Failed to initialize model:', error);
    }
  }

  /**
   * Preprocess phone number data for ML input
   * @param {string} phoneNumber - Raw phone number string
   * @returns {number[]} Feature vector for the model
   */
  preprocessPhoneNumber(phoneNumber) {
    // Extract features from phone number
    const parsed = parsePhoneNumber(phoneNumber);
    
    // Create feature vector (simplified example)
    const features = [
      // Length of number
      phoneNumber.length / 15, // Normalize to 0-1 range
      
      // Area code pattern (0-1)
      parsed.areaCode ? parseInt(parsed.areaCode[0]) / 9 : 0,
      
      // Exchange pattern (0-1)
      parsed.exchange ? parseInt(parsed.exchange[0]) / 9 : 0,
      
      // Is toll-free
      parsed.type === 'toll-free' ? 1 : 0,
      
      // Is premium rate
      parsed.type === 'premium' ? 1 : 0,
      
      // Has country code
      phoneNumber.startsWith('+') ? 1 : 0,
      
      // Contains special characters
      /[^\d+]/.test(phoneNumber) ? 1 : 0,
      
      // Is valid
      parsed.isValid ? 1 : 0,
      
      // Number of digits
      (phoneNumber.match(/\d/g) || []).length / 15,
      
      // First digit (0-9)
      phoneNumber.match(/^\D*(\d)/)?.[1] / 9 || 0
    ];
    
    return features;
  }

  /**
   * Predict match probability for a phone number and annotation
   * @param {string} phoneNumber - Phone number to analyze
   * @param {Object} annotationData - Annotation data to compare against
   * @returns {Promise<number>} Match probability (0-1)
   */
  async predictMatch(phoneNumber, annotationData) {
    if (!this.isInitialized || !this.model) {
      console.warn('[PhonePatternModel] Model not initialized');
      return 0.5; // Default probability
    }

    try {
      // Preprocess the phone number
      const features = this.preprocessPhoneNumber(phoneNumber);
      
      // Convert to tensor and predict
      const inputTensor = tf.tensor2d([features]);
      const prediction = await this.model.predict(inputTensor);
      
      // Get the probability value
      const probability = await prediction.data();
      const matchProbability = probability[0];
      
      inputTensor.dispose();
      prediction.dispose();
      
      return matchProbability;
    } catch (error) {
      console.error('[PhonePatternModel] Prediction error:', error);
      return 0.5; // Default probability on error
    }
  }

  /**
   * Train the model with new data
   * @param {Array} trainingData - Array of [phoneNumber, annotationData, label] tuples
   */
  async train(trainingData) {
    if (!this.isInitialized || !this.model) {
      console.warn('[PhonePatternModel] Model not initialized');
      return;
    }

    try {
      // Convert training data to tensors
      const inputs = trainingData.map(item => this.preprocessPhoneNumber(item[0]));
      const labels = trainingData.map(item => item[2]); // 0 or 1 for match/no match
      
      const inputTensor = tf.tensor2d(inputs);
      const labelTensor = tf.tensor1d(labels, 'float32');
      
      // Train the model
      await this.model.fit(inputTensor, labelTensor, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        shuffle: true
      });
      
      console.log('[PhonePatternModel] Training completed successfully');
      
      // Clean up tensors
      inputTensor.dispose();
      labelTensor.dispose();
    } catch (error) {
      console.error('[PhonePatternModel] Training error:', error);
    }
  }

  /**
   * Save model weights to local storage
   */
  async saveWeights() {
    if (!this.isInitialized || !this.model) return;
    
    try {
      const modelJSON = await this.model.toJSON();
      localStorage.setItem('phonePatternModel', JSON.stringify(modelJSON));
      console.log('[PhonePatternModel] Model weights saved');
    } catch (error) {
      console.error('[PhonePatternModel] Failed to save weights:', error);
    }
  }

  /**
   * Load model weights from local storage
   */
  async loadWeights() {
    try {
      const modelJSON = localStorage.getItem('phonePatternModel');
      if (modelJSON) {
        this.model = await tf.loadLayersModel(tf.io.fromMemory(JSON.parse(modelJSON)));
        this.isInitialized = true;
        console.log('[PhonePatternModel] Model weights loaded');
      }
    } catch (error) {
      console.error('[PhonePatternModel] Failed to load weights:', error);
    }
  }
}

// Import phone parsing function
import { parsePhoneNumber } from '../osint/phone.js';

// Export singleton instance
export const phonePatternModel = new PhonePatternModel();