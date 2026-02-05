// ============================================
// Visualization 6: Travel Category Distribution Bar Chart
// ============================================

class TravelCategoryBarChart {
    constructor() {
        this.colors = ['#ef4444', '#dc2626', '#f97316', '#ea580c', '#fbbf24', '#f59e0b', '#fb923c', '#fdba74', '#fed7aa', '#fde68a'];
    }
    
    async render(container) {
        // Load CSV data directly
        const csvData = await this.loadCSV('data/cleaned_data.csv');
        
        if (!csvData || csvData.length === 0) {
            container.innerHTML = '<p style="color: #6b7280;">No data available</p>';
            return;
        }
        
        // Count travel category occurrences
        const categoryCounts = {};
        
        csvData.forEach(row => {
            if (row.travel_category && row.travel_category.trim() !== '') {
                const category = row.travel_category.trim();
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
        });
        
        // Convert to array and sort by count descending
        const data = Object.entries(categoryCounts)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value);
        
        if (data.length === 0) {
            container.innerHTML = '<p style="color: #6b7280;">No travel category data available</p>';
            return;
        }
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', '0 0 800 600')
            .attr('preserveAspectRatio', 'xMidYMid meet');
        
        const margin = { top: 70, right: 70, bottom: 70, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        
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
        const x = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([0, width])
            .padding(0.25);
        
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .nice()
            .range([height, 0]);
        
        // X axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('font-size', '12px')
            .attr('font-weight', '500')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');
        
        // Y axis
        g.append('g')
            .call(d3.axisLeft(y))
            .selectAll('text')
            .attr('font-size', '12px');
        
        // Grid lines
        g.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y)
                .tickSize(-width)
                .tickFormat('')
            )
            .style('stroke', '#e5e7eb')
            .style('stroke-dasharray', '3,3')
            .style('opacity', 0.5);
        
        // Y-axis label
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -35)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', '500')
            .attr('fill', '#9ca3af')
            .text('Number of Prompts');
        
        // Bars with animation
        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.label))
            .attr('width', x.bandwidth())
            .attr('y', height)
            .attr('height', 0)
            .attr('fill', (d, i) => this.colors[i % this.colors.length])
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.8);
                
                tooltip
                    .style('opacity', 1)
                    .html(`<strong>${d.label}</strong><br/>Count: ${d.value}`);
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
            .attr('y', d => y(d.value))
            .attr('height', d => height - y(d.value));
        
        // Value labels on bars
        g.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => x(d.label) + x.bandwidth() / 2)
            .attr('y', d => y(d.value) - 5)
            .attr('text-anchor', 'middle')
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
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .attr('font-size', '18px')
            .attr('font-weight', '500')
            .attr('fill', '#9ca3af')
            .text('Distribution of Travel Categories');
        
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
        description.textContent = 'This visualization shows how many prompts occur under which category. Gives an idea of what topic related to travel do users prompt about.';
        
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
