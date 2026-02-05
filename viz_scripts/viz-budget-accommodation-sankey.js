/**
 * Multi-Stage Sankey Diagram: Country → Budget → Accommodation
 * Shows the flow from destinations through budget categories to accommodation types
 */
class BudgetAccommodationSankey {
    constructor() {
        this.margin = { top: 40, right: 100, bottom: 30, left: 100 };
        this.width = 1000 - this.margin.left - this.margin.right;
        this.height = 700 - this.margin.top - this.margin.bottom;
        
        // Color palettes for each stage (red/orange/yellow theme)
        this.countryColors = [
            '#ef4444', '#dc2626', '#f97316', '#ea580c', '#fbbf24',
            '#f59e0b', '#fb923c', '#fdba74', '#fed7aa', '#fde68a',
            '#b91c1c', '#c2410c', '#d97706', '#ca8a04', '#eab308'
        ];
        
        this.budgetColors = {
            'Cheap': '#fbbf24',
            'Affordable': '#f97316',
            'Luxury': '#ef4444'
        };
        
        this.accommodationColors = {
            'Hotel': '#dc2626',
            'Hostel': '#ea580c',
            'AirBnB': '#f59e0b',
            'Camping': '#fb923c',
            'Villa': '#fdba74'
        };
    }

    async render(container) {
        try {
            // Load CSV data
            const csvData = await this.loadCSV('data/cleaned_data.csv');
            
            // Process data to extract three-stage flows
            const flowData = this.processMultiStageFlowData(csvData);
            
            if (flowData.links.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 50px;">No multi-stage flow data available</p>';
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
            
            // Create title
            svg.append('text')
                .attr('x', this.width / 2)
                .attr('y', -25)
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('font-weight', '600')
                .style('fill', '#ffffff')
                .text('Travel Journey: Destination → Budget → Accommodation');
            
            // Add stage labels
            const stageLabels = ['Countries', 'Budget', 'Accommodation'];
            const stagePositions = [0, this.width / 2, this.width];
            
            stageLabels.forEach((label, i) => {
                svg.append('text')
                    .attr('x', stagePositions[i])
                    .attr('y', -5)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '11px')
                    .style('font-weight', '500')
                    .style('fill', '#f97316')
                    .text(label);
            });
            
            // Setup Sankey layout
            const sankey = d3.sankey()
                .nodeId(d => d.id)
                .nodeWidth(20)
                .nodePadding(12)
                .extent([[0, 10], [this.width, this.height]]);
            
            // Generate the sankey diagram
            const sankeyData = sankey({
                nodes: flowData.nodes.map(d => Object.assign({}, d)),
                links: flowData.links.map(d => Object.assign({}, d))
            });
            
            // Add links (flows)
            const link = svg.append('g')
                .attr('class', 'links')
                .selectAll('.link')
                .data(sankeyData.links)
                .enter()
                .append('path')
                .attr('class', 'link')
                .attr('d', d3.sankeyLinkHorizontal())
                .attr('stroke', d => {
                    // Use source node color for the link
                    return d.source.color;
                })
                .attr('stroke-width', d => Math.max(1, d.width))
                .style('fill', 'none')
                .style('opacity', 0.35)
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .style('opacity', 0.7)
                        .style('stroke-width', Math.max(2, d.width + 2));
                    
                    // Show tooltip
                    const tooltip = d3.select('body').append('div')
                        .attr('class', 'sankey-tooltip')
                        .style('position', 'absolute')
                        .style('background', 'rgba(0, 0, 0, 0.85)')
                        .style('color', 'white')
                        .style('padding', '10px 14px')
                        .style('border-radius', '6px')
                        .style('font-size', '13px')
                        .style('pointer-events', 'none')
                        .style('z-index', '1000')
                        .style('box-shadow', '0 4px 6px rgba(0,0,0,0.2)')
                        .html(`
                            <strong>${d.source.name}</strong> → <strong>${d.target.name}</strong><br/>
                            <span style="color: #a3e635;">Travelers: ${d.value}</span>
                        `)
                        .style('left', (event.pageX + 15) + 'px')
                        .style('top', (event.pageY - 15) + 'px');
                })
                .on('mouseout', function(event, d) {
                    d3.select(this)
                        .style('opacity', 0.35)
                        .style('stroke-width', Math.max(1, d.width));
                    
                    d3.selectAll('.sankey-tooltip').remove();
                });
            
            // Add nodes (countries, budget, accommodations)
            const node = svg.append('g')
                .attr('class', 'nodes')
                .selectAll('.node')
                .data(sankeyData.nodes)
                .enter()
                .append('g')
                .attr('class', 'node');
            
            // Add rectangles for nodes (only for budget and accommodation stages)
            node.append('rect')
                .attr('x', d => d.x0)
                .attr('y', d => d.y0)
                .attr('height', d => d.y1 - d.y0)
                .attr('width', d => d.x1 - d.x0)
                .attr('fill', d => d.color)
                .attr('rx', 3)
                .style('stroke', '#fff')
                .style('stroke-width', 2)
                .style('cursor', 'pointer')
                .style('opacity', d => d.stage === 'country' ? 0 : 1)
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .style('opacity', 0.8)
                        .style('stroke', '#fbbf24')
                        .style('stroke-width', 3);
                    
                    // Highlight connected links
                    link.style('opacity', l => {
                        if (l.source === d || l.target === d) {
                            return 0.7;
                        }
                        return 0.1;
                    });
                    
                    // Show node tooltip
                    const tooltip = d3.select('body').append('div')
                        .attr('class', 'sankey-node-tooltip')
                        .style('position', 'absolute')
                        .style('background', 'rgba(0, 0, 0, 0.85)')
                        .style('color', 'white')
                        .style('padding', '10px 14px')
                        .style('border-radius', '6px')
                        .style('font-size', '13px')
                        .style('pointer-events', 'none')
                        .style('z-index', '1000')
                        .style('box-shadow', '0 4px 6px rgba(0,0,0,0.2)')
                        .html(`
                            <strong>${d.name}</strong><br/>
                            <span style="color: #a3e635;">Total: ${d.value}</span>
                        `)
                        .style('left', (event.pageX + 15) + 'px')
                        .style('top', (event.pageY - 15) + 'px');
                })
                .on('mouseout', function() {
                    d3.select(this)
                        .style('opacity', 1)
                        .style('stroke', '#fff')
                        .style('stroke-width', 2);
                    
                    link.style('opacity', 0.35);
                    d3.selectAll('.sankey-node-tooltip').remove();
                });
            
            // Add labels for nodes
            node.append('text')
                .attr('x', d => {
                    // Position text based on which column the node is in
                    if (d.x0 < this.width / 3) {
                        // Left column (countries) - text to the left
                        return d.x0 - 6;
                    } else if (d.x0 > 2 * this.width / 3) {
                        // Right column (accommodations) - text to the left
                        return d.x0 - 6;
                    } else {
                        // Middle column (budget) - text to the right
                        return d.x1 + 6;
                    }
                })
                .attr('y', d => (d.y1 + d.y0) / 2)
                .attr('dy', '0.35em')
                .attr('text-anchor', d => {
                    if (d.x0 < this.width / 3 || d.x0 > 2 * this.width / 3) {
                        return 'end'; // Left and right columns
                    }
                    return 'start'; // Middle column
                })
                .style('font-size', '10px')
                .style('font-weight', '600')
                .style('fill', '#f97316')
                .text(d => `${d.name} (${d.value})`);
            
            // Legend removed as per user request
            // this.addMultiStageLegend(svg, flowData);
            
            // Add description
            this.addDescription(container);
            
        } catch (error) {
            console.error('Error rendering Budget-Accommodation Sankey:', error);
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
        description.textContent = 'This visualization shows in which country do people prefer what type of budget and which type of accomodation. For example, people may prefer to live in a cheap airbnb in a mountain place or a luxury villa near beach.';
        
        container.appendChild(description);
    }

    processMultiStageFlowData(csvData) {
        const flows = new Map();
        const countrySet = new Set();
        const budgetSet = new Set();
        const accommodationSet = new Set();
        
        // Budget and accommodation column names
        const budgetColumns = ['Cheap', 'Affordable', 'Luxury'];
        const accommodationColumns = ['Hotel', 'Hostel', 'AirBnB', 'Camping', 'Villa'];
        
        // Extract three-stage flows: Country → Budget → Accommodation
        csvData.forEach(row => {
            let countries = [];
            
            // Handle Country column (may contain curly braces or commas)
            if (row.Country && row.Country.trim() !== '') {
                const countryValue = row.Country.trim();
                if (countryValue.startsWith('{') && countryValue.endsWith('}')) {
                    // Handle curly braces format: {country1, country2}
                    countries = countryValue
                        .slice(1, -1)
                        .split(',')
                        .map(c => c.trim())
                        .filter(c => c !== '');
                } else if (countryValue.includes(',')) {
                    // Handle comma-separated format: country1, country2
                    countries = countryValue
                        .split(',')
                        .map(c => c.trim())
                        .filter(c => c !== '');
                } else {
                    // Single country
                    countries = [countryValue];
                }
            }
            
            // Find which budget categories are marked
            const budgets = [];
            budgetColumns.forEach(budget => {
                if (row[budget] === 'y') {
                    budgets.push(budget);
                }
            });
            
            // Find which accommodations are marked
            const accommodations = [];
            accommodationColumns.forEach(accommodation => {
                if (row[accommodation] === 'y') {
                    accommodations.push(accommodation);
                }
            });
            
            // Create three-stage flows: Country → Budget → Accommodation
            countries.forEach(country => {
                budgets.forEach(budget => {
                    // Country to Budget flow
                    const countryBudgetKey = `${country}→${budget}`;
                    flows.set(countryBudgetKey, (flows.get(countryBudgetKey) || 0) + 1);
                    countrySet.add(country);
                    budgetSet.add(budget);
                    
                    accommodations.forEach(accommodation => {
                        // Budget to Accommodation flow
                        const budgetAccommodationKey = `${budget}→${accommodation}`;
                        flows.set(budgetAccommodationKey, (flows.get(budgetAccommodationKey) || 0) + 1);
                        accommodationSet.add(accommodation);
                    });
                });
            });
        });
        
        // Create nodes array with unique IDs
        const nodes = [];
        const nodeMap = new Map();
        
        // Add country nodes (stage 1)
        const countryArray = Array.from(countrySet).sort();
        countryArray.forEach((country, idx) => {
            const id = `country_${country}`;
            nodeMap.set(country, id);
            nodes.push({
                id: id,
                name: country,
                color: this.countryColors[idx % this.countryColors.length],
                stage: 'country'
            });
        });
        
        // Add budget nodes (stage 2)
        const budgetArray = Array.from(budgetSet).sort();
        budgetArray.forEach(budget => {
            const id = `budget_${budget}`;
            nodeMap.set(budget, id);
            nodes.push({
                id: id,
                name: budget,
                color: this.budgetColors[budget] || '#9ca3af',
                stage: 'budget'
            });
        });
        
        // Add accommodation nodes (stage 3)
        const accommodationArray = Array.from(accommodationSet).sort();
        accommodationArray.forEach(accommodation => {
            const id = `accommodation_${accommodation}`;
            nodeMap.set(accommodation, id);
            nodes.push({
                id: id,
                name: accommodation,
                color: this.accommodationColors[accommodation] || '#9ca3af',
                stage: 'accommodation'
            });
        });
        
        // Create links array
        const links = [];
        flows.forEach((value, key) => {
            const [source, target] = key.split('→');
            const sourceId = nodeMap.get(source);
            const targetId = nodeMap.get(target);
            
            if (sourceId && targetId) {
                links.push({
                    source: sourceId,
                    target: targetId,
                    value: value
                });
            }
        });
        
        // Sort links by value (descending)
        links.sort((a, b) => b.value - a.value);
        
        return {
            nodes,
            links,
            countries: countryArray,
            budgets: budgetArray,
            accommodations: accommodationArray
        };
    }

    addMultiStageLegend(svg, flowData) {
        const legendY = this.height - 80;
        
        // Budget legend
        const budgetLegend = svg.append('g')
            .attr('class', 'budget-legend')
            .attr('transform', `translate(20, ${legendY})`);
        
        budgetLegend.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', '#1f2937')
            .text('Budget Types');
        
        flowData.budgets.forEach((budget, i) => {
            const item = budgetLegend.append('g')
                .attr('transform', `translate(0, ${(i + 1) * 18})`);
            
            item.append('rect')
                .attr('width', 12)
                .attr('height', 12)
                .attr('rx', 2)
                .style('fill', this.budgetColors[budget]);
            
            item.append('text')
                .attr('x', 18)
                .attr('y', 10)
                .style('font-size', '10px')
                .style('fill', '#4b5563')
                .text(budget);
        });
        
        // Accommodation legend
        const accomLegend = svg.append('g')
            .attr('class', 'accommodation-legend')
            .attr('transform', `translate(${this.width - 130}, ${legendY})`);
        
        accomLegend.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', '#1f2937')
            .text('Accommodation');
        
        flowData.accommodations.forEach((accommodation, i) => {
            const item = accomLegend.append('g')
                .attr('transform', `translate(0, ${(i + 1) * 18})`);
            
            item.append('rect')
                .attr('width', 12)
                .attr('height', 12)
                .attr('rx', 2)
                .style('fill', this.accommodationColors[accommodation]);
            
            item.append('text')
                .attr('x', 18)
                .attr('y', 10)
                .style('font-size', '10px')
                .style('fill', '#4b5563')
                .text(accommodation);
        });
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
