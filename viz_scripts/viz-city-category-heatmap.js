/**
 * City vs Travel Category Heatmap
 * Shows correlation between top destinations and travel categories
 */
class CityCategoryHeatmap {
    constructor() {
        this.margin = { top: 60, right: 40, bottom: 120, left: 100 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;
        
        // Number of top cities to display
        this.topCitiesCount = 10;
        
        // Color scale for heatmap (yellow to red gradient)
        this.colorScale = d3.scaleLinear()
            .range(['#fbbf24', '#ef4444']);
    }

    async render(container) {
        try {
            // Load CSV data
            const csvData = await this.loadCSV('../data/cleaned_data.csv');
            
            // Process data to create heatmap matrix
            const { matrix, topCities, categories, maxValue } = this.processHeatmapData(csvData);
            
            if (matrix.length === 0 || topCities.length === 0 || categories.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 50px;">No city-category data available</p>';
                return;
            }
            
            // Update color scale domain
            this.colorScale.domain([0, maxValue]);
            
            // Clear container
            container.innerHTML = '';
            
            // Create SVG
            const svg = d3.select(container)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
                .attr('preserveAspectRatio', 'xMidYMid meet')
                .append('g')
                .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
            
            // Add title
            svg.append('text')
                .attr('x', this.width / 2)
                .attr('y', -30)
                .attr('text-anchor', 'middle')
                .style('font-size', '18px')
                .style('font-weight', '500')
                .style('fill', '#9ca3af')
                .text('Top Destinations by Travel Category');
            
            // Calculate cell dimensions
            const cellWidth = this.width / categories.length;
            const cellHeight = this.height / topCities.length;
            
            // Create cells
            const cells = svg.selectAll('.cell')
                .data(matrix)
                .enter()
                .append('g')
                .attr('class', 'cell')
                .attr('transform', d => `translate(${d.col * cellWidth}, ${d.row * cellHeight})`);
            
            // Add rectangles
            cells.append('rect')
                .attr('width', cellWidth - 2)
                .attr('height', cellHeight - 2)
                .attr('rx', 4)
                .style('fill', d => this.colorScale(d.value))
                .style('stroke', '#fff')
                .style('stroke-width', 2)
                .style('cursor', 'pointer')
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .style('stroke', '#7c3aed')
                        .style('stroke-width', 3)
                        .style('opacity', 0.9);
                    
                    // Show tooltip
                    const tooltip = d3.select('body').append('div')
                        .attr('class', 'heatmap-tooltip')
                        .style('position', 'absolute')
                        .style('background', 'rgba(0, 0, 0, 0.9)')
                        .style('color', 'white')
                        .style('padding', '12px 16px')
                        .style('border-radius', '8px')
                        .style('font-size', '13px')
                        .style('pointer-events', 'none')
                        .style('z-index', '1000')
                        .style('box-shadow', '0 4px 6px rgba(0,0,0,0.3)')
                        .html(`
                            <strong>${d.city}</strong><br/>
                            <span style="color: #c4b5fd;">${d.category}</span><br/>
                            <span style="color: #a78bfa; font-size: 16px; font-weight: 600;">${d.value}</span> 
                            <span style="color: #d1d5db;">mentions</span>
                        `)
                        .style('left', (event.pageX + 15) + 'px')
                        .style('top', (event.pageY - 15) + 'px');
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .style('stroke', '#fff')
                        .style('stroke-width', 2)
                        .style('opacity', 1);
                    
                    d3.selectAll('.heatmap-tooltip').remove();
                });
            
            // Add text values in cells
            cells.append('text')
                .attr('x', cellWidth / 2)
                .attr('y', cellHeight / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('font-weight', '600')
                .style('fill', '#000000')
                .style('pointer-events', 'none')
                .text(d => d.value > 0 ? d.value : '');
            
            // Add X-axis labels (Travel Categories) - rotated
            svg.selectAll('.x-label')
                .data(categories)
                .enter()
                .append('text')
                .attr('class', 'x-label')
                .attr('transform', (d, i) => {
                    const x = i * cellWidth + cellWidth / 2;
                    const y = this.height + 15;
                    return `translate(${x},${y}) rotate(-45)`;
                })
                .attr('text-anchor', 'end')
                .style('font-size', '11px')
                .style('font-weight', '500')
                .style('fill', '#f97316')
                .text(d => d);
            
            // Add Y-axis labels (Cities)
            svg.selectAll('.y-label')
                .data(topCities)
                .enter()
                .append('text')
                .attr('class', 'y-label')
                .attr('x', -10)
                .attr('y', (d, i) => i * cellHeight + cellHeight / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'end')
                .style('font-size', '12px')
                .style('font-weight', '500')
                .style('fill', '#f97316')
                .text(d => d);
            
            // Add description
            this.addDescription(container);
            
        } catch (error) {
            console.error('Error rendering City-Category Heatmap:', error);
            container.innerHTML = `<p style="color: red; text-align: center; padding: 50px;">Error loading visualization: ${error.message}</p>`;
        }
    }
    
    addDescription(container) {
        // Only show description in fullscreen mode, not in preview grid
        const isPreviewMode = container.id.includes('preview') || container.closest('.viz-preview');
        
        if (isPreviewMode) {
            return; // Don't add description in preview mode
        }
        
        const description = document.createElement('div');
        description.className = 'viz-description';
        description.style.cssText = `
            padding: 16px;
            margin-top: 36px;
            background: #000000;
            border-left: 3px solid #fbbf24;
            color: #d1d5db;
            font-size: 13px;
            line-height: 1.6;
            border-radius: 4px;
            display: block;
        `;
        description.textContent = 'This visualization shows what occurances of top cities in different categories of travel prompts. Gives an idea of what type of prompt people give regarding a particular city.';
        
        container.appendChild(description);
    }

    processHeatmapData(csvData) {
        // Count occurrences of each city-category pair
        const cityCategoryMap = new Map();
        const cityTotalCounts = new Map();
        const categorySet = new Set();
        
        csvData.forEach(row => {
            // Extract cities
            let cities = [];
            if (row.City && row.City.trim() !== '') {
                const cityValue = row.City.trim();
                if (cityValue.startsWith('{') && cityValue.endsWith('}')) {
                    cities = cityValue
                        .slice(1, -1)
                        .split(',')
                        .map(c => c.trim())
                        .filter(c => c !== '');
                } else {
                    cities = [cityValue];
                }
            }
            
            // Extract travel category
            const category = row.travel_category ? row.travel_category.trim() : '';
            
            // Only process if both city and category exist
            if (cities.length > 0 && category !== '') {
                categorySet.add(category);
                
                cities.forEach(city => {
                    // Count city-category pair
                    const key = `${city}|${category}`;
                    cityCategoryMap.set(key, (cityCategoryMap.get(key) || 0) + 1);
                    
                    // Count total for each city
                    cityTotalCounts.set(city, (cityTotalCounts.get(city) || 0) + 1);
                });
            }
        });
        
        // Get top N cities by total count
        const topCities = Array.from(cityTotalCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, this.topCitiesCount)
            .map(([city]) => city);
        
        // Get all categories sorted alphabetically
        const categories = Array.from(categorySet).sort();
        
        // Build matrix
        const matrix = [];
        let maxValue = 0;
        
        topCities.forEach((city, row) => {
            categories.forEach((category, col) => {
                const key = `${city}|${category}`;
                const value = cityCategoryMap.get(key) || 0;
                
                matrix.push({
                    row: row,
                    col: col,
                    city: city,
                    category: category,
                    value: value
                });
                
                if (value > maxValue) {
                    maxValue = value;
                }
            });
        });
        
        return { matrix, topCities, categories, maxValue };
    }

    // CSV Loading Utilities
    async loadCSV(filePath) {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load CSV: ${response.statusText}`);
        }
        const text = await response.text();
        return this.parseCSV(text);
    }

    parseCSV(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return [];
        
        // Parse header
        const headers = this.parseCSVLine(lines[0]);
        
        // Parse data rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }
        
        return data;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }
}
