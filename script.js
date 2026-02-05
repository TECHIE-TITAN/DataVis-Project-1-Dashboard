// ============================================
// Dashboard Controller
// ============================================

class DashboardController {
    constructor() {
        this.modal = document.getElementById('fullscreenModal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalBody = document.getElementById('fullscreenViz');
        this.closeBtn = document.getElementById('closeBtn');
        this.overlay = this.modal.querySelector('.modal-overlay');
        this.currentVizId = null;
        
        this.init();
    }
    
    async init() {
        // No need to load data centrally anymore
        console.log('Dashboard initialized');
        
        // Initialize preview visualizations
        await this.initPreviews();
        
        // Add event listeners to all visualization sections
        const vizSections = document.querySelectorAll('.viz-section');
        vizSections.forEach(section => {
            section.addEventListener('click', () => this.openViz(section));
            section.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openViz(section);
                }
            });
        });
        
        // Close button
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        // Close on overlay click
        this.overlay.addEventListener('click', () => this.closeModal());
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (this.currentVizId) {
                    this.renderFullscreenViz(this.currentVizId);
                }
            }, 250);
        });
    }
    
    openViz(section) {
        const vizId = section.dataset.vizId;
        const title = section.querySelector('.viz-title').textContent;
        
        this.currentVizId = vizId;
        this.modalTitle.textContent = title;
        
        // Show modal with animation
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Render fullscreen visualization
        this.renderFullscreenViz(vizId);
        
        // Focus on close button for accessibility
        setTimeout(() => this.closeBtn.focus(), 100);
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentVizId = null;
        
        // Clear modal content
        this.modalBody.innerHTML = '';
    }
    
    renderFullscreenViz(vizId) {
        // Clear previous content
        this.modalBody.innerHTML = '';
        
        // Create visualization container
        const container = document.createElement('div');
        container.id = `viz-${vizId}-fullscreen`;
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.position = 'relative';
        this.modalBody.appendChild(container);
        
        // Render based on visualization type using modular classes
        switch(vizId) {
            case '1':
                new AccommodationPieChart().render(container);
                break;
            case '2':
                new TravelModePieChart().render(container);
                break;
            case '3':
                new SocialGroupBarChart().render(container);
                break;
            case '4':
                new TopCitiesBarChart().render(container, 10);
                break;
            case '5':
                new WorldMapAccommodations().render(container);
                break;
            case '6':
                new TravelCategoryBarChart().render(container);
                break;
            case '7':
                new CountryCitySankey().render(container);
                break;
            case '8':
                new BudgetAccommodationSankey().render(container);
                break;
            case '9':
                new DestinationsWordCloud().render(container);
                break;
            case '10':
                new TravelDurationHistogram().render(container);
                break;
            case '11':
                new SocialPurposeHeatmap().render(container);
                break;
            case '12':
                new CityCategoryHeatmap().render(container);
                break;
            case '13':
                new SeasonCitiesDivergingChart().render(container);
                break;
            case '14':
                this.renderScatterPlot(container);
                break;
            default:
                container.innerHTML = '<p style="color: #6b7280;">Visualization coming soon...</p>';
        }
    }
    
    async initPreviews() {
        // Initialize small preview versions of visualizations in their boxes
        const vizSections = document.querySelectorAll('.viz-section');
        
        vizSections.forEach(async (section) => {
            const vizId = section.dataset.vizId;
            const previewContainer = section.querySelector('.viz-preview');
            
            // Clear placeholder
            previewContainer.innerHTML = '';
            previewContainer.style.background = '#0a0a0a';
            previewContainer.style.display = 'flex';
            previewContainer.style.alignItems = 'center';
            previewContainer.style.justifyContent = 'center';
            previewContainer.style.overflow = 'hidden';
            
            // Render preview visualization
            await this.renderPreview(vizId, previewContainer);
        });
    }
    
    async renderPreview(vizId, container) {
        // Create a wrapper for the preview
        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        wrapper.style.position = 'relative';
        wrapper.style.pointerEvents = 'none'; // Prevent interaction in preview
        container.appendChild(wrapper);
        
        // Render based on visualization type
        try {
            switch(vizId) {
                case '1':
                    await new AccommodationPieChart().render(wrapper);
                    break;
                case '2':
                    await new TravelModePieChart().render(wrapper);
                    break;
                case '3':
                    await new SocialGroupBarChart().render(wrapper);
                    break;
                case '4':
                    await new TopCitiesBarChart().render(wrapper, 10);
                    break;
                case '5':
                    await new WorldMapAccommodations().render(wrapper);
                    break;
                case '6':
                    await new TravelCategoryBarChart().render(wrapper);
                    break;
                case '7':
                    await new CountryCitySankey().render(wrapper);
                    break;
                case '8':
                    await new BudgetAccommodationSankey().render(wrapper);
                    break;
                case '9':
                    await new DestinationsWordCloud().render(wrapper);
                    break;
                case '10':
                    await new TravelDurationHistogram().render(wrapper);
                    break;
                case '11':
                    await new SocialPurposeHeatmap().render(wrapper);
                    break;
                case '12':
                    await new CityCategoryHeatmap().render(wrapper);
                    break;
                case '13':
                    await new SeasonCitiesDivergingChart().render(wrapper);
                    break;
                case '14':
                    wrapper.innerHTML = '<p style="color: #9ca3af; text-align: center;">Coming soon</p>';
                    break;
                default:
                    wrapper.innerHTML = '<p style="color: #9ca3af; text-align: center;">Preview unavailable</p>';
            }
        } catch (error) {
            console.error(`Error rendering preview for viz ${vizId}:`, error);
            wrapper.innerHTML = '<p style="color: #ef4444; text-align: center; font-size: 12px;">Error loading preview</p>';
        }
    }
    
    // ============================================
    // Placeholder Visualization Renderers
    // (Visualizations 1, 2, 3, 4, 6, 10 are in separate viz-*.js files)
    // ============================================
    
    renderWorldMap(container) {
        container.innerHTML = `
            <div style="text-align: center; color: #6b7280; padding: 40px;">
                <h3 style="font-size: 24px; margin-bottom: 16px; color: #1f2937;">World Map Visualization</h3>
                <p>Geographic distribution of accommodations</p>
                <p style="margin-top: 20px; font-size: 14px;">Requires TopoJSON data and implementation</p>
            </div>
        `;
    }
    
    renderSankeyDiagram(container, type) {
        container.innerHTML = `
            <div style="text-align: center; color: #6b7280; padding: 40px;">
                <h3 style="font-size: 24px; margin-bottom: 16px; color: #1f2937;">
                    ${type === 'metro' ? 'Country to City Flow' : 'Multi-Stage Flow Diagram'}
                </h3>
                <p>Sankey diagram showing ${type === 'metro' ? 'travel flows' : 'country → budget → accommodation'}</p>
                <p style="margin-top: 20px; font-size: 14px;">Requires d3-sankey plugin and flow data</p>
            </div>
        `;
    }
    
    renderWordCloud(container) {
        container.innerHTML = `
            <div style="text-align: center; color: #6b7280; padding: 40px;">
                <h3 style="font-size: 24px; margin-bottom: 16px; color: #1f2937;">Popular Destinations</h3>
                <p>Word cloud of most frequent destinations</p>
                <p style="margin-top: 20px; font-size: 14px;">Requires d3-cloud library</p>
            </div>
        `;
    }
    
    renderHeatmap(container, type) {
        container.innerHTML = `
            <div style="text-align: center; color: #6b7280; padding: 40px;">
                <h3 style="font-size: 24px; margin-bottom: 16px; color: #1f2937;">
                    ${type === 'social-purpose' ? 'Social Group vs. Travel Purpose' : 'Top 10 Destinations by Category'}
                </h3>
                <p>Heatmap showing correlations</p>
                <p style="margin-top: 20px; font-size: 14px;">Requires correlation data matrix</p>
            </div>
        `;
    }
    
    renderBubbleChart(container) {
        container.innerHTML = `
            <div style="text-align: center; color: #6b7280; padding: 40px;">
                <h3 style="font-size: 24px; margin-bottom: 16px; color: #1f2937;">Season vs. Location</h3>
                <p>Bubble chart showing destination popularity by season</p>
                <p style="margin-top: 20px; font-size: 14px;">Requires seasonal data</p>
            </div>
        `;
    }
    
    renderScatterPlot(container) {
        container.innerHTML = `
            <div style="text-align: center; color: #6b7280; padding: 40px;">
                <h3 style="font-size: 24px; margin-bottom: 16px; color: #1f2937;">Country Accommodation</h3>
                <p>Scatter plot of accommodation types by city</p>
                <p style="margin-top: 20px; font-size: 14px;">Requires city-level accommodation data</p>
            </div>
        `;
    }
}

// ============================================
// Initialize Dashboard
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardController();
    console.log('Dashboard initialized successfully');
});

// ============================================
// Utility Functions
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
