// ============================================
// Visualization 4: Top Cities Horizontal Bar Chart
// ============================================

class TopCitiesBarChart {
    constructor() {
        this.colors = ['#ef4444', '#dc2626', '#f97316', '#ea580c', '#fbbf24', '#f59e0b', '#fb923c', '#fdba74', '#fed7aa', '#fde68a'];
    }
    
    async render(container, topN = 10) {
        // Load CSV data directly
        const csvData = await this.loadCSV('data/cleaned_data.csv');
        
        if (!csvData || csvData.length === 0) {
            container.innerHTML = '<p style="color: #6b7280;">No data available</p>';
            return;
        }
        
        // Count city occurrences
        const cityCounts = {};
        
        csvData.forEach(row => {
            if (row.City && row.City.trim() !== '') {
                const cityValue = row.City.trim();
                
                // Check if value contains curly braces (multiple cities)
                if (cityValue.startsWith('{') && cityValue.endsWith('}')) {
                    // Extract cities from {city1, city2, city3} format
                    const citiesString = cityValue.slice(1, -1); // Remove { and }
                    const cities = citiesString.split(',').map(c => c.trim());
                    
                    cities.forEach(city => {
                        if (city !== '') {
                            cityCounts[city] = (cityCounts[city] || 0) + 1;
                        }
                    });
                } else {
                    // Single city
                    cityCounts[cityValue] = (cityCounts[cityValue] || 0) + 1;
                }
            }
        });
        
        // Convert to array and sort by count
        const data = Object.entries(cityCounts)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, topN);
        
        if (data.length === 0) {
            container.innerHTML = '<p style="color: #6b7280;">No city data available</p>';
            return;
        }
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 800 600')
            .attr('preserveAspectRatio', 'xMidYMid meet');
        
        const margin = { top: 60, right: 40, bottom: 80, left: 150 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
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
        
        // Scales
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .nice()
            .range([0, width]);
        
        const y = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([0, height])
            .padding(0.2);
        
        // X axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('font-size', '12px');
        
        // Y axis
        g.append('g')
            .call(d3.axisLeft(y))
            .selectAll('text')
            .attr('font-size', '13px')
            .attr('font-weight', '500');
        
        // Grid lines
        g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x)
                .tickSize(-height)
                .tickFormat('')
            )
            .style('stroke', '#e5e7eb')
            .style('stroke-dasharray', '3,3')
            .style('opacity', 0.5);
        
        // Axis labels
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height + 50)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', '600')
            .attr('fill', '#ffffff')
            .text('Number of Mentions');
        
        g.append('text')
            .attr('x', -10)
            .attr('y', -35)
            .attr('text-anchor', 'end')
            .attr('font-size', '14px')
            .attr('font-weight', '600')
            .attr('fill', '#ffffff')
            .text('City');
        
        // Bars with animation
        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', d => y(d.label))
            .attr('width', 0)
            .attr('height', y.bandwidth())
            .attr('fill', (d, i) => this.colors[i % this.colors.length])
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.8);
                
                tooltip
                    .style('opacity', 1)
                    .html(`<strong>${d.label}</strong><br/>Mentions: ${d.value}`);
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
                    .attr('opacity', 1);
                
                tooltip.style('opacity', 0);
            })
            .transition()
            .duration(800)
            .attr('width', d => x(d.value));
        
        // Value labels on bars
        g.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => x(d.value) + 5)
            .attr('y', d => y(d.label) + y.bandwidth() / 2 + 5)
            .attr('font-size', '13px')
            .attr('font-weight', '700')
            .attr('fill', '#fbbf24')
            .style('opacity', 0)
            .text(d => d.value)
            .transition()
            .delay(800)
            .duration(400)
            .style('opacity', 1);
        
        // Title
        svg.append('text')
            .attr('x', 400)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '22px')
            .attr('font-weight', '700')
            .attr('fill', '#ffffff')
            .text(`Top ${topN} Most Mentioned Cities`);
        
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
        description.textContent = 'This visualization shows a ranked comparison of the most referenced cities. Allows easy comparison between cities.';
        
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
