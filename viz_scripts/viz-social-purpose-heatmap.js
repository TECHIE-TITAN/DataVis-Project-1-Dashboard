/**
 * Social Group vs Travel Purpose Heatmap
 * Shows correlation between social groups and travel purposes
 */
class SocialPurposeHeatmap {
    constructor() {
        this.margin = { top: 60, right: 40, bottom: 80, left: 120 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;
        
        // Define social groups and travel purposes
        this.socialGroups = ['Solo', 'Couple', 'Family', 'Friends'];
        this.travelPurposes = [
            'Business',
            'Pilgrimage or heritage',
            'Adventure',
            'Cuisine',
            'Sight Seeing',
            'Nightlife',
            'Shopping',
            'Competitions'
        ];
        
        // Color scale for heatmap (yellow to red gradient - low to high)
        this.colorScale = d3.scaleLinear()
            .range(['#fbbf24', '#f97316', '#ef4444']);
    }

    async render(container) {
        try {
            // Load CSV data
            const csvData = await this.loadCSV('../data/cleaned_data.csv');
            
            // Process data to create heatmap matrix
            const { matrix, maxValue } = this.processHeatmapData(csvData);
            
            if (maxValue === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 50px;">No correlation data available</p>';
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
                .style('font-size', '16px')
                .style('font-weight', '600')
                .style('fill', '#ffffff')
                .text('Social Group vs Travel Purpose');
            
            // Calculate cell dimensions
            const cellWidth = this.width / this.socialGroups.length;
            const cellHeight = this.height / this.travelPurposes.length;
            
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
                        .style('stroke', '#1f2937')
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
                            <strong>${d.socialGroup}</strong> → <strong>${d.purpose}</strong><br/>
                            <span style="color: #fbbf24; font-size: 16px; font-weight: 600;">${d.value}</span> 
                            <span style="color: #d1d5db;">co-occurrences</span>
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
                .style('font-size', '14px')
                .style('font-weight', '600')
                .style('fill', d => d.value > maxValue / 2 ? '#fff' : '#1f2937')
                .style('pointer-events', 'none')
                .text(d => d.value > 0 ? d.value : '');
            
            // Add X-axis labels (Social Groups)
            svg.selectAll('.x-label')
                .data(this.socialGroups)
                .enter()
                .append('text')
                .attr('class', 'x-label')
                .attr('x', (d, i) => i * cellWidth + cellWidth / 2)
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('font-weight', '600')
                .style('fill', '#f97316')
                .text(d => d);
            
            // Add Y-axis labels (Travel Purposes)
            svg.selectAll('.y-label')
                .data(this.travelPurposes)
                .enter()
                .append('text')
                .attr('class', 'y-label')
                .attr('x', -10)
                .attr('y', (d, i) => i * cellHeight + cellHeight / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'end')
                .style('font-size', '11px')
                .style('font-weight', '500')
                .style('fill', '#f97316')
                .text(d => d);
            
            // Add axis titles
            svg.append('text')
                .attr('x', this.width / 2)
                .attr('y', this.height + 50)
                .attr('text-anchor', 'middle')
                .style('font-size', '13px')
                .style('font-weight', '600')
                .style('fill', '#ffffff')
                .text('Social Groups');
            
            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -this.height / 2)
                .attr('y', -this.margin.left + 25)
                .attr('text-anchor', 'middle')
                .style('font-size', '13px')
                .style('font-weight', '600')
                .style('fill', '#ffffff')
                .text('Travel Purposes');
            
            // Add color legend (removed to save space)
            // this.addColorLegend(svg, maxValue);
            
            // Add description
            this.addDescription(container);
            
        } catch (error) {
            console.error('Error rendering Heatmap:', error);
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
        description.textContent = 'This visualization shows what all activities do different social groups prefer and look for in their prompts.';
        
        container.appendChild(description);
    }

    processHeatmapData(csvData) {
        // Initialize correlation matrix
        const correlationMatrix = {};
        
        this.socialGroups.forEach(group => {
            correlationMatrix[group] = {};
            this.travelPurposes.forEach(purpose => {
                correlationMatrix[group][purpose] = 0;
            });
        });
        
        // Count co-occurrences
        csvData.forEach(row => {
            // Check which social groups are present
            const presentGroups = this.socialGroups.filter(group => row[group] === 'y');
            
            // Check which travel purposes are present
            const presentPurposes = this.travelPurposes.filter(purpose => row[purpose] === 'y');
            
            // Only count if at least one from each set is present
            if (presentGroups.length > 0 && presentPurposes.length > 0) {
                // Count all pairs
                presentGroups.forEach(group => {
                    presentPurposes.forEach(purpose => {
                        correlationMatrix[group][purpose]++;
                    });
                });
            }
        });
        
        // Convert to array format for D3
        const matrix = [];
        let maxValue = 0;
        
        this.travelPurposes.forEach((purpose, row) => {
            this.socialGroups.forEach((group, col) => {
                const value = correlationMatrix[group][purpose];
                matrix.push({
                    row: row,
                    col: col,
                    socialGroup: group,
                    purpose: purpose,
                    value: value
                });
                
                if (value > maxValue) {
                    maxValue = value;
                }
            });
        });
        
        return { matrix, maxValue };
    }

    addColorLegend(svg, maxValue) {
        const legendWidth = 200;
        const legendHeight = 15;
        const legendX = this.width - legendWidth - 10;
        const legendY = this.height + 70;
        
        // Create gradient
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', 'heatmap-gradient')
            .attr('x1', '0%')
            .attr('x2', '100%')
            .attr('y1', '0%')
            .attr('y2', '0%');
        
        // Add color stops
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const value = (i / steps) * maxValue;
            gradient.append('stop')
                .attr('offset', `${(i / steps) * 100}%`)
                .attr('stop-color', this.colorScale(value));
        }
        
        // Legend group
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${legendX}, ${legendY})`);
        
        // Legend rectangle
        legend.append('rect')
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr('rx', 3)
            .style('fill', 'url(#heatmap-gradient)')
            .style('stroke', '#d1d5db')
            .style('stroke-width', 1);
        
        // Legend labels
        legend.append('text')
            .attr('x', 0)
            .attr('y', legendHeight + 18)
            .style('font-size', '11px')
            .style('fill', '#6b7280')
            .text('0');
        
        legend.append('text')
            .attr('x', legendWidth)
            .attr('y', legendHeight + 18)
            .attr('text-anchor', 'end')
            .style('font-size', '11px')
            .style('fill', '#6b7280')
            .text(maxValue);
        
        legend.append('text')
            .attr('x', legendWidth / 2)
            .attr('y', -8)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('font-weight', '600')
            .style('fill', '#374151')
            .text('Co-occurrence Count');
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
