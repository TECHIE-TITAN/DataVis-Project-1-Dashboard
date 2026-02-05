// ============================================
// Visualization 1: Accommodation Preferences Pie Chart
// ============================================

class AccommodationPieChart {
    constructor() {
        this.colors = {
            'Hotel': '#ef4444',
            'Hostel': '#f97316',
            'AirBnB': '#fbbf24',
            'Villa': '#fb923c',
            'Camping': '#fdba74'
        };
    }
    
    async render(container) {
        // Load CSV data directly
        const csvData = await this.loadCSV('../data/cleaned_data.csv');
        
        if (!csvData || csvData.length === 0) {
            container.innerHTML = '<p style="color: #6b7280;">No data available</p>';
            return;
        }
        
        // Count 'y' values in accommodation columns
        const counts = {
            'Hotel': 0,
            'Hostel': 0,
            'AirBnB': 0,
            'Villa': 0,
            'Camping': 0
        };
        
        csvData.forEach(row => {
            if (row.Hotel === 'y') counts['Hotel']++;
            if (row.Hostel === 'y') counts['Hostel']++;
            if (row.AirBnB === 'y') counts['AirBnB']++;
            if (row.Villa === 'y') counts['Villa']++;
            if (row.Camping === 'y') counts['Camping']++;
        });
        
        // Calculate total and percentages
        const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
        
        if (total === 0) {
            container.innerHTML = '<p style="color: #6b7280;">No accommodation data found</p>';
            return;
        }
        
        // Prepare data for pie chart
        const data = Object.entries(counts)
            .filter(([_, count]) => count > 0)
            .map(([label, count]) => ({
                label: label,
                value: ((count / total) * 100).toFixed(1),
                count: count,
                color: this.colors[label] || '#6b7280'
            }));
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 800 600')
            .attr('preserveAspectRatio', 'xMidYMid meet');
        
        const width = 800, height = 600;
        const radius = Math.min(width, height) / 2 - 100;
        
        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);
        
        const pie = d3.pie()
            .value(d => d.value)
            .sort((a, b) => b.value - a.value);
        
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
        
        const outerArc = d3.arc()
            .innerRadius(radius * 1.1)
            .outerRadius(radius * 1.1);
        
        const arcHover = d3.arc()
            .innerRadius(0)
            .outerRadius(radius + 10);
        
        const arcs = g.selectAll('arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');
        
        // Create tooltip
        const tooltip = d3.select(container)
            .append('div')
            .style('position', 'absolute')
            .style('background', 'white')
            .style('border', '1px solid #e5e7eb')
            .style('border-radius', '6px')
            .style('padding', '8px 12px')
            .style('font-size', '12px')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('box-shadow', '0 2px 8px rgba(0,0,0,0.15)')
            .style('z-index', '1000');
        
        // Draw slices with animation
        arcs.append('path')
            .attr('fill', d => d.data.color)
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('d', arcHover);
                
                tooltip
                    .style('opacity', 1)
                    .html(`
                        <strong>${d.data.label}</strong><br/>
                        Count: ${d.data.count}<br/>
                        Percentage: ${d.data.value}%
                    `);
            })
            .on('mousemove', function(event) {
                tooltip
                    .style('left', (event.pageX - container.getBoundingClientRect().left + 10) + 'px')
                    .style('top', (event.pageY - container.getBoundingClientRect().top - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('d', arc);
                
                tooltip.style('opacity', 0);
            })
            .transition()
            .duration(800)
            .attrTween('d', function(d) {
                const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function(t) {
                    return arc(interpolate(t));
                };
            });
        
        // Add leader lines
        arcs.append('polyline')
            .attr('stroke', d => d.data.color)
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .style('opacity', 0)
            .attr('points', d => {
                const pos = outerArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                // Special positioning for AirBnB to push it right
                if (d.data.label === 'AirBnB') {
                    pos[0] = radius * 1.3; // Always to the right
                } else {
                    pos[0] = radius * 1.2 * (midAngle < Math.PI ? 1 : -1);
                }
                return [arc.centroid(d), outerArc.centroid(d), pos];
            })
            .transition()
            .delay(800)
            .duration(400)
            .style('opacity', 0.9);
        
        // Add value labels with leader lines (only percentage in white)
        arcs.append('text')
            .attr('transform', d => {
                const pos = outerArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                // Special positioning for AirBnB to push it right
                if (d.data.label === 'AirBnB') {
                    pos[0] = radius * 1.3; // Always to the right
                } else {
                    pos[0] = radius * 1.2 * (midAngle < Math.PI ? 1 : -1);
                }
                return `translate(${pos})`;
            })
            .attr('text-anchor', d => {
                // AirBnB always aligns left (since it's on the right)
                if (d.data.label === 'AirBnB') {
                    return 'start';
                }
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return midAngle < Math.PI ? 'start' : 'end';
            })
            .style('opacity', 0)
            .style('font-size', '14px')
            .style('font-weight', '600')
            .style('fill', d => d.data.color)
            .text(d => `${d.data.value}%`)
            .transition()
            .delay(800)
            .duration(400)
            .style('opacity', 1);
        
        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '18px')
            .attr('font-weight', '600')
            .attr('fill', '#ffffff')
            .text('Accommodation Preferences');
        
        // Add legend (only in fullscreen mode)
        if (container.offsetWidth > 700) {
            const legend = svg.append('g')
                .attr('transform', `translate(${width - 150}, 60)`);
            
            data.forEach((item, i) => {
                const legendRow = legend.append('g')
                    .attr('transform', `translate(0, ${i * 25})`);
                
                legendRow.append('rect')
                    .attr('width', 18)
                    .attr('height', 18)
                    .attr('fill', item.color)
                    .attr('rx', 3);
                
                legendRow.append('text')
                    .attr('x', 25)
                    .attr('y', 13)
                    .attr('font-size', '12px')
                    .attr('fill', '#f97316')
                    .text(item.label);
            });
        }
        
        // Add description
        this.addDescription(container);
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
        description.textContent = 'This visualization shows what all types of accomodations do people prefer and prompt about. It summarizes overall lodging preferences.';
        
        container.appendChild(description);
    }
    
    // CSV loading utility
    async loadCSV(filePath) {
        try {
            const response = await fetch(filePath);
            const text = await response.text();
            return this.parseCSV(text);
        } catch (error) {
            console.error('Error loading CSV:', error);
            return null;
        }
    }
    
    parseCSV(text) {
        const lines = text.split('\n');
        const headers = this.parseCSVLine(lines[0]).map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = this.parseCSVLine(lines[i]);
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });
            
            data.push(row);
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
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        
        return result;
    }
}
