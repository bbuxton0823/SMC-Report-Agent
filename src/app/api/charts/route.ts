import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

const execAsync = promisify(exec);

/**
 * Handle POST requests to generate charts using the Python visualization agent
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { chartType, data, title, xLabel, yLabel, colors } = body;

    // Validate required fields
    if (!chartType || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: chartType and data' },
        { status: 400 }
      );
    }

    // Prepare the input data for the Python script
    const inputData = {
      chartType,
      data,
      title,
      xLabel,
      yLabel,
      colors
    };

    // Create a temporary file for the input data
    const tempDir = os.tmpdir();
    const inputFilePath = path.join(tempDir, `chart-input-${uuidv4()}.json`);
    
    try {
      // Write the input data to the temporary file
      fs.writeFileSync(inputFilePath, JSON.stringify(inputData));
      
      // Check if the Python script exists
      const scriptPath = path.join(process.cwd(), 'src/lib/agents/visualization.py');
      if (!fs.existsSync(scriptPath)) {
        return NextResponse.json(
          { error: 'Visualization script not found' },
          { status: 500 }
        );
      }

      // Execute the Python script with the input file path as an argument
      const { stdout, stderr } = await execAsync(`python ${scriptPath} ${inputFilePath}`, {
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large images
      });

      // Clean up the temporary file
      fs.unlinkSync(inputFilePath);

      // Check for errors from the Python script
      if (stderr) {
        console.error('Python script error:', stderr);
        return NextResponse.json(
          { error: 'Error generating chart: ' + stderr },
          { status: 500 }
        );
      }

      // Parse the output from the Python script
      const result = JSON.parse(stdout);
      
      // Check if there was an error in the Python script
      if (result.error) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      // Return the chart data
      return NextResponse.json(result);
    } catch (error) {
      // Clean up the temporary file if it exists
      if (fs.existsSync(inputFilePath)) {
        fs.unlinkSync(inputFilePath);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error generating chart:', error);
    return NextResponse.json(
      { error: 'Failed to generate chart: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 