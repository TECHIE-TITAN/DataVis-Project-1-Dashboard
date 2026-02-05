/**
 * Season vs Top Cities Diverging Bar Chart
 * Shows Summer (left) and Winter (right) travel patterns for top 10 cities
 */
class SeasonCitiesDivergingChart {
    constructor() {
        this.margin = { top: 60, right: 40, bottom: 80, left: 100 };
        this.width = 800 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;
        
        // Number of top cities to display
        this.topCitiesCount = 10;
        
        // Colors for seasons (red/orange/yellow theme)
        this.summerColor = '#fbbf24'; // Bright yellow for summer
        this.winterColor = '#ef4444'; // Red for winter
    }

    async render(container) {
        try {
            // Load CSV data
            const csvData = await this.loadCSV('data/cleaned_data.csv');
            
            // Process data to get top cities with summer/winter counts
            const cityData = this.processCitySeasonData(csvData);
            
            if (cityData.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 50px;">No city-season data available</p>';
                return;
            }
            
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
                .style('font-weight', '600')
                .style('fill', '#ffffff')
                .text('Summer vs Winter: Top Travel Destinations');
            
            // Calculate scales
            const maxValue = d3.max(cityData, d => Math.max(d.summer, d.winter));
            
            // X scale for both directions
            const xScale = d3.scaleLinear()
                .domain([0, maxValue])
                .range([0, this.width / 2 - 40]);
            
            // Y scale for cities
            const yScale = d3.scaleBand()
                .domain(cityData.map(d => d.city))
                .range([0, this.height])
                .padding(0.25);
            
            // Center line position
            const centerX = this.width / 2;
            
            // Draw center line
            svg.append('line')
                .attr('x1', centerX)
                .attr('x2', centerX)
                .attr('y1', -10)
                .attr('y2', this.height + 10)
                .style('stroke', '#9ca3af')
                .style('stroke-width', 2)
                .style('stroke-dasharray', '5,5');
            
            // Create bars group
            const barsGroup = svg.append('g').attr('class', 'bars');
            
            // Summer bars (left side)
            const summerBars = barsGroup.selectAll('.summer-bar')
                .data(cityData)
                .enter()
                .append('rect')
                .attr('class', 'summer-bar')
                .attr('x', d => centerX - xScale(d.summer))
                .attr('y', d => yScale(d.city))
                .attr('width', 0)
                .attr('height', yScale.bandwidth())
                .attr('rx', 4)
                .style('fill', this.summerColor)
                .style('cursor', 'pointer')
                .on('mouseover', (event, d) => {
                    d3.select(event.currentTarget)
                        .style('opacity', 0.8)
                        .style('stroke', '#dc2626')
                        .style('stroke-width', 2);
                    
                    this.showTooltip(event, d.city, 'Summer', d.summer, this.summerColor);
                })
                .on('mouseout', (event) => {
                    d3.select(event.currentTarget)
                        .style('opacity', 1)
                        .style('stroke', 'none');
                    
                    this.hideTooltip();
                });
            
            // Animate summer bars
            summerBars.transition()
                .duration(1000)
                .delay((d, i) => i * 100)
                .attr('width', d => xScale(d.summer));
            
            // Winter bars (right side)
            const winterBars = barsGroup.selectAll('.winter-bar')
                .data(cityData)
                .enter()
                .append('rect')
                .attr('class', 'winter-bar')
                .attr('x', centerX)
                .attr('y', d => yScale(d.city))
                .attr('width', 0)
                .attr('height', yScale.bandwidth())
                .attr('rx', 4)
                .style('fill', this.winterColor)
                .style('cursor', 'pointer')
                .on('mouseover', (event, d) => {
                    d3.select(event.currentTarget)
                        .style('opacity', 0.8)
                        .style('stroke', '#1e3a8a')
                        .style('stroke-width', 2);
                    
                    this.showTooltip(event, d.city, 'Winter', d.winter, this.winterColor);
                })
                .on('mouseout', (event) => {
                    d3.select(event.currentTarget)
                        .style('opacity', 1)
                        .style('stroke', 'none');
                    
                    this.hideTooltip();
                });
            
            // Animate winter bars
            winterBars.transition()
                .duration(1000)
                .delay((d, i) => i * 100)
                .attr('width', d => xScale(d.winter));
            
            // Add value labels for summer (left side)
            const summerLabels = barsGroup.selectAll('.summer-label')
                .data(cityData)
                .enter()
                .append('text')
                .attr('class', 'summer-label')
                .attr('x', d => centerX - xScale(d.summer) - 8)
                .attr('y', d => yScale(d.city) + yScale.bandwidth() / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'end')
                .style('font-size', '12px')
                .style('font-weight', '600')
                .style('fill', '#92400e')
                .style('opacity', 0)
                .text(d => d.summer);
            
            summerLabels.transition()
                .duration(1000)
                .delay((d, i) => i * 100 + 500)
                .style('opacity', 1);
            
            // Add value labels for winter (right side)
            const winterLabels = barsGroup.selectAll('.winter-label')
                .data(cityData)
                .enter()
                .append('text')
                .attr('class', 'winter-label')
                .attr('x', d => centerX + xScale(d.winter) + 8)
                .attr('y', d => yScale(d.city) + yScale.bandwidth() / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'start')
                .style('font-size', '12px')
                .style('font-weight', '600')
                .style('fill', '#1e3a8a')
                .style('opacity', 0)
                .text(d => d.winter);
            
            winterLabels.transition()
                .duration(1000)
                .delay((d, i) => i * 100 + 500)
                .style('opacity', 1);
            
            // Add city labels in the center
            const cityLabels = svg.selectAll('.city-label')
                .data(cityData)
                .enter()
                .append('text')
                .attr('class', 'city-label')
                .attr('x', -90)
                .attr('y', d => yScale(d.city) + yScale.bandwidth() / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', 'start')
                .style('font-size', '12px')
                .style('font-weight', '600')
                .style('fill', '#ffffff')
                .style('pointer-events', 'none')
                .style('opacity', 0)
                .text(d => d.city);
            
            cityLabels.transition()
                .duration(800)
                .delay((d, i) => i * 100 + 300)
                .style('opacity', 1);
            
            // Add X-axis for summer (left)
            const xAxisLeftScale = d3.scaleLinear()
                .domain([maxValue, 0])
                .range([0, this.width / 2 - 40]);
            
            const xAxisLeft = d3.axisBottom(xAxisLeftScale)
                .ticks(5)
                .tickFormat(d => d === 0 ? '' : Math.abs(d));
            
            svg.append('g')
                .attr('class', 'x-axis-left')
                .attr('transform', `translate(${40}, ${this.height + 10})`)
                .call(xAxisLeft)
                .selectAll('text')
                .style('font-size', '11px')
                .style('fill', '#6b7280');
            
            // Add X-axis for winter (right)
            const xAxisRightScale = d3.scaleLinear()
                .domain([0, maxValue])
                .range([0, this.width / 2 - 40]);
            
            const xAxisRight = d3.axisBottom(xAxisRightScale)
                .ticks(5)
                .tickFormat(d => d === 0 ? '' : d);
            
            svg.append('g')
                .attr('class', 'x-axis-right')
                .attr('transform', `translate(${centerX}, ${this.height + 10})`)
                .call(xAxisRight)
                .selectAll('text')
                .style('font-size', '11px')
                .style('fill', '#6b7280');
            
            // Add center "0" label
            svg.append('text')
                .attr('x', centerX)
                .attr('y', this.height + 25)
                .attr('text-anchor', 'middle')
                .style('font-size', '11px')
                .style('fill', '#9ca3af')
                .text('0');
            
            // Add axis labels
            svg.append('text')
                .attr('x', this.width / 4)
                .attr('y', this.height + 50)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', '600')
                .style('fill', '#ffffff')
                .html('☀️ Summer Visits');
            
            svg.append('text')
                .attr('x', centerX + this.width / 4)
                .attr('y', this.height + 50)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', '600')
                .style('fill', '#ffffff')
                .html('❄️ Winter Visits');
            
            // Add description
            this.addDescription(container);
            
        } catch (error) {
            console.error('Error rendering Season-Cities Diverging Chart:', error);
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
        description.textContent = 'This visualization shows how travel popularity for cities differs between summer and winter. This highlights seasonal travel patterns.';
        
        container.appendChild(description);
    }

    processCitySeasonData(csvData) {
        // Count summer and winter occurrences for each city
        const citySeasonCounts = new Map();
        
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
            
            // Check for summer and winter
            const isSummer = row.Summer === 'y';
            const isWinter = row.Winter === 'y';
            
            // Count for each city
            cities.forEach(city => {
                if (!citySeasonCounts.has(city)) {
                    citySeasonCounts.set(city, { summer: 0, winter: 0, total: 0 });
                }
                
                const counts = citySeasonCounts.get(city);
                if (isSummer) counts.summer++;
                if (isWinter) counts.winter++;
                counts.total++;
            });
        });
        
        // Convert to array and sort by total mentions
        const cityArray = Array.from(citySeasonCounts.entries())
            .map(([city, counts]) => ({
                city: city,
                summer: counts.summer,
                winter: counts.winter,
                total: counts.total
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, this.topCitiesCount);
        
        return cityArray;
    }

    showTooltip(event, city, season, count, color) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'diverging-tooltip')
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
                <div style="border-left: 4px solid ${color}; padding-left: 10px;">
                    <strong style="font-size: 15px;">${city}</strong><br/>
                    <span style="color: ${color === this.summerColor ? '#fbbf24' : '#60a5fa'};">
                        ${season === 'Summer' ? '☀️' : '❄️'} ${season}
                    </span><br/>
                    <span style="color: #e5e7eb; font-size: 16px; font-weight: 600;">${count}</span> 
                    <span style="color: #d1d5db;">visits</span>
                </div>
            `)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 15) + 'px');
    }

    hideTooltip() {
        d3.selectAll('.diverging-tooltip').remove();
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
