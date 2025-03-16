import { API_URL } from './env';
import { InputData } from '@/components/inputs/InputPanel';

/**
 * API service for making requests to the backend
 */

/**
 * Generate a report based on the provided input data
 */
export async function generateReport(inputData: InputData): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate report');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

/**
 * Generate a chart using the Python visualization agent
 */
export async function generateChart(
  chartType: string,
  data: any,
  title?: string,
  xLabel?: string,
  yLabel?: string,
  colors?: string[]
): Promise<{ image: string; chartType: string; title: string }> {
  try {
    const response = await fetch(`${API_URL}/charts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chartType,
        data,
        title,
        xLabel,
        yLabel,
        colors
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate chart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating chart:', error);
    throw error;
  }
}

/**
 * Save a report version to the backend
 */
export async function saveReportVersion(content: string, name?: string): Promise<{ id: string; timestamp: Date; name?: string; content: string }> {
  try {
    const response = await fetch(`${API_URL}/versions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save report version');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving report version:', error);
    throw error;
  }
}

/**
 * Get all report versions from the backend
 */
export async function getReportVersions(): Promise<Array<{ id: string; timestamp: Date; name?: string; content: string }>> {
  try {
    const response = await fetch(`${API_URL}/versions`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get report versions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting report versions:', error);
    throw error;
  }
} 