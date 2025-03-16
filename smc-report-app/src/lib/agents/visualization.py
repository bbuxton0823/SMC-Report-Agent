#!/usr/bin/env python3
"""
Visualization Agent for generating charts and graphs.

This module provides functionality to generate various types of charts
and return them as base64 encoded images for embedding in HTML.
"""

import io
import base64
import json
import matplotlib
import matplotlib.pyplot as plt
import sys
from typing import Dict, List, Optional, Any, Tuple

# Configure matplotlib to use non-interactive backend
matplotlib.use('Agg')


# Define chart types and their configurations
CHART_TYPES = {
    'bar': {
        'description': 'Bar chart for comparing categorical data'
    },
    'line': {
        'description': 'Line chart for showing trends over time'
    },
    'pie': {
        'description': 'Pie chart for showing proportions of a whole'
    },
    'scatter': {
        'description': 'Scatter plot for showing correlation between variables'
    },
    'histogram': {
        'description': 'Histogram for showing distribution of data'
    }
}


class VisualizationAgent:
    """Agent for generating visualizations based on data."""
    
    def generate_chart(
        self,
        chart_type: str,
        data: Dict[str, Any],
        title: Optional[str] = None,
        x_label: Optional[str] = None,
        y_label: Optional[str] = None,
        colors: Optional[List[str]] = None
    ) -> Tuple[str, str]:
        """
        Generate a chart based on the provided data and parameters.
        
        Args:
            chart_type: Type of chart to generate (bar, line, pie, etc.)
            data: Data to visualize
            title: Chart title
            x_label: Label for x-axis
            y_label: Label for y-axis
            colors: List of colors for the chart elements
            
        Returns:
            Tuple containing the base64 encoded image and the chart type
        """
        if chart_type not in CHART_TYPES:
            raise ValueError(f"Unsupported chart type: {chart_type}")
        
        # Create figure and axis
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Set title if provided
        if title:
            ax.set_title(title)
            
        # Set axis labels if provided
        if x_label:
            ax.set_xlabel(x_label)
        if y_label:
            ax.set_ylabel(y_label)
            
        # Generate the specified chart type
        if chart_type == 'bar':
            self._generate_bar_chart(ax, data, colors)
        elif chart_type == 'line':
            self._generate_line_chart(ax, data, colors)
        elif chart_type == 'pie':
            self._generate_pie_chart(fig, ax, data, colors)
        elif chart_type == 'scatter':
            self._generate_scatter_chart(ax, data, colors)
        elif chart_type == 'histogram':
            self._generate_histogram(ax, data, colors)
        
        # Convert plot to base64 string
        buffer = io.BytesIO()
        fig.tight_layout()
        fig.savefig(buffer, format='png')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close(fig)
        
        return image_base64, chart_type
    
    def _generate_bar_chart(self, ax, data, colors=None):
        """Generate a bar chart."""
        if 'categories' not in data or 'values' not in data:
            raise ValueError(
                "Bar chart requires 'categories' and 'values' in data"
            )
            
        categories = data['categories']
        values = data['values']
        
        ax.bar(categories, values, color=colors)
    
    def _generate_line_chart(self, ax, data, colors=None):
        """Generate a line chart."""
        if 'x' not in data or 'y' not in data:
            raise ValueError("Line chart requires 'x' and 'y' in data")
            
        x = data['x']
        y = data['y']
        
        ax.plot(x, y, color=colors[0] if colors else None)
    
    def _generate_pie_chart(self, fig, ax, data, colors=None):
        """Generate a pie chart."""
        if 'labels' not in data or 'values' not in data:
            raise ValueError(
                "Pie chart requires 'labels' and 'values' in data"
            )
            
        labels = data['labels']
        values = data['values']
        
        ax.pie(values, labels=labels, autopct='%1.1f%%', colors=colors)
        ax.axis('equal')  # Equal aspect ratio ensures pie is drawn as a circle
    
    def _generate_scatter_chart(self, ax, data, colors=None):
        """Generate a scatter chart."""
        if 'x' not in data or 'y' not in data:
            raise ValueError("Scatter chart requires 'x' and 'y' in data")
            
        x = data['x']
        y = data['y']
        
        ax.scatter(x, y, color=colors[0] if colors else None)
    
    def _generate_histogram(self, ax, data, colors=None):
        """Generate a histogram."""
        if 'values' not in data:
            raise ValueError("Histogram requires 'values' in data")
            
        values = data['values']
        bins = data.get('bins', 10)
        
        ax.hist(values, bins=bins, color=colors[0] if colors else None)


def process_request(request_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process a request to generate a chart.
    
    Args:
        request_data: Dictionary containing the request parameters
        
    Returns:
        Dictionary containing the response data
    """
    try:
        chart_type = request_data.get('chartType')
        data = request_data.get('data')
        title = request_data.get('title')
        x_label = request_data.get('xLabel')
        y_label = request_data.get('yLabel')
        colors = request_data.get('colors')
        
        if not chart_type or not data:
            return {
                'error': 'Missing required parameters: chartType and data'
            }
        
        agent = VisualizationAgent()
        image, chart_type = agent.generate_chart(
            chart_type, data, title, x_label, y_label, colors
        )
        
        return {
            'image': image,
            'chartType': chart_type,
            'title': title or 'Chart'
        }
    except Exception as e:
        return {'error': str(e)}


if __name__ == '__main__':
    # Check if a file path is provided as an argument
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        try:
            with open(input_file, 'r') as f:
                request_data = json.load(f)
        except Exception as e:
            print(json.dumps({'error': f'Error reading input file: {str(e)}'}))
            sys.exit(1)
    else:
        # Read from stdin
        try:
            request_data = json.loads(sys.stdin.read())
        except Exception as e:
            print(json.dumps({'error': f'Error parsing JSON input: {str(e)}'}))
            sys.exit(1)
    
    # Process the request and print the result
    result = process_request(request_data)
    print(json.dumps(result)) 