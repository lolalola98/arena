// Arena API integration
class ArenaDisplay {
    constructor(config) {
        this.token = config.token;
        this.channelSlug = config.channelSlug;
        this.perPage = config.perPage || 12;
        this.currentPage = 1;
        this.hasMorePages = true;
        this.baseUrl = 'https://api.are.na/v3';
    }

    async fetchChannel() {
        try {
            const response = await fetch(`${this.baseUrl}/channels/${this.channelSlug}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch channel: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching channel:', error);
            throw error;
        }
    }

    async fetchContents(page = 1) {
        try {
            const url = `${this.baseUrl}/channels/${this.channelSlug}/contents?page=${page}&per=${this.perPage}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch contents: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            this.hasMorePages = data.meta.has_more_pages;
            return data;
        } catch (error) {
            console.error('Error fetching contents:', error);
            throw error;
        }
    }

    renderChannelInfo(channel) {
        const infoDiv = document.getElementById('channel-info');
        const description = channel.description?.plain || channel.description?.html || '';
        
        infoDiv.innerHTML = `
            <h2>${channel.title}</h2>
            ${description ? `<div class="description">${description}</div>` : ''}
            <div class="meta">
                ${channel.counts.contents} blocks · 
                By ${channel.owner.name} · 
                Updated ${new Date(channel.updated_at).toLocaleDateString()}
            </div>
        `;
    }

    renderBlock(block) {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block';
        
        let content = '';
        
        // Helper function to get image URL with fallbacks
        const getImageUrl = (block) => {
            return block.image?.large?.src || 
                   block.image?.original?.src ||
                   block.image?.display?.src ||
                   block.image?.src ||
                   block.attachment?.url ||
                   null;
        };
        
        // Handle different block types
        switch (block.type) {
            case 'Image':
                const imageUrl = getImageUrl(block);
                content = `
                    ${imageUrl ? `<img src="${imageUrl}" alt="${block.title || 'Image'}" class="block-image">` : ''}
                    <div class="block-content">
                        ${block.title ? `<div class="block-title">${block.title}</div>` : ''}
                        ${block.description ? `<div class="block-description">${block.description}</div>` : ''}
                        ${block.source?.url ? `<a href="${block.source.url}" target="_blank" class="block-link">View Source</a>` : ''}
                        <div class="block-meta">
                            <span class="block-type">Image</span>
                            <span>${new Date(block.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'Text':
                content = `
                    <div class="block-content">
                        ${block.title ? `<div class="block-title">${block.title}</div>` : ''}
                        <div class="block-text-content">${block.content_html || block.content || ''}</div>
                        <div class="block-meta">
                            <span class="block-type">Text</span>
                            <span>${new Date(block.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'Link':
                const linkImageUrl = getImageUrl(block);
                content = `
                    ${linkImageUrl ? `<img src="${linkImageUrl}" alt="${block.title || 'Link'}" class="block-image">` : ''}
                    <div class="block-content">
                        ${block.title ? `<div class="block-title">${block.title}</div>` : ''}
                        ${block.description ? `<div class="block-description">${block.description}</div>` : ''}
                        <a href="${block.source.url}" target="_blank" class="block-link">${block.source.url}</a>
                        <div class="block-meta">
                            <span class="block-type">Link</span>
                            <span>${new Date(block.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'Attachment':
                content = `
                    <div class="block-content">
                        ${block.title ? `<div class="block-title">${block.title}</div>` : ''}
                        ${block.description ? `<div class="block-description">${block.description}</div>` : ''}
                        <a href="${block.attachment.url}" target="_blank" class="block-link">Download ${block.attachment.file_name}</a>
                        <div class="block-meta">
                            <span class="block-type">File</span>
                            <span>${new Date(block.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'Embed':
                const embedImageUrl = getImageUrl(block);
                content = `
                    ${embedImageUrl ? `<img src="${embedImageUrl}" alt="${block.title || 'Embed'}" class="block-image">` : ''}
                    <div class="block-content">
                        ${block.title ? `<div class="block-title">${block.title}</div>` : ''}
                        ${block.description ? `<div class="block-description">${block.description}</div>` : ''}
                        ${block.source?.url ? `<a href="${block.source.url}" target="_blank" class="block-link">View Source</a>` : ''}
                        <div class="block-meta">
                            <span class="block-type">Embed</span>
                            <span>${new Date(block.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
                break;
                
            case 'Channel':
                content = `
                    <div class="block-content">
                        <div class="block-title">${block.title}</div>
                        ${block.description?.plain ? `<div class="block-description">${block.description.plain}</div>` : ''}
                        <div class="block-meta">
                            <span class="block-type">Channel</span>
                            <span>${block.counts.contents} blocks</span>
                        </div>
                    </div>
                `;
                break;
                
            default:
                content = `
                    <div class="block-content">
                        <div class="block-title">${block.title || 'Unknown type'}</div>
                        <div class="block-meta">
                            <span class="block-type">${block.type}</span>
                            <span>${new Date(block.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
        }
        
        blockDiv.innerHTML = content;
        return blockDiv;
    }

    async loadBlocks(page = 1) {
        const container = document.getElementById('blocks-container');
        const loadingDiv = document.getElementById('loading');
        const errorDiv = document.getElementById('error');
        const loadMoreBtn = document.getElementById('load-more');
        
        try {
            loadingDiv.style.display = 'block';
            errorDiv.style.display = 'none';
            if (loadMoreBtn) loadMoreBtn.disabled = true;
            
            const data = await this.fetchContents(page);
            
            loadingDiv.style.display = 'none';
            
            // Render blocks
            data.data.forEach(block => {
                const blockElement = this.renderBlock(block);
                container.appendChild(blockElement);
            });
            
            // Update load more button
            if (loadMoreBtn) {
                if (this.hasMorePages) {
                    loadMoreBtn.style.display = 'block';
                    loadMoreBtn.disabled = false;
                } else {
                    loadMoreBtn.style.display = 'none';
                }
            }
            
            this.currentPage = page;
            
        } catch (error) {
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'block';
            errorDiv.textContent = `Error loading blocks: ${error.message}`;
        }
    }

    async init() {
        try {
            // Load channel info
            const channel = await this.fetchChannel();
            this.renderChannelInfo(channel);
            
            // Load first page of blocks
            await this.loadBlocks(1);
            
        } catch (error) {
            const errorDiv = document.getElementById('error');
            errorDiv.style.display = 'block';
            errorDiv.textContent = `Error initializing: ${error.message}`;
            document.getElementById('loading').style.display = 'none';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Check if config exists
    if (typeof CONFIG === 'undefined') {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').innerHTML = `
            <strong>Configuration missing!</strong><br>
            Please create a <code>config.js</code> file based on <code>config.example.js</code>
        `;
        document.getElementById('loading').style.display = 'none';
        return;
    }
    
    // Validate config
    if (!CONFIG.token || CONFIG.token === 'YOUR_TOKEN_HERE') {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').innerHTML = `
            <strong>Token not configured!</strong><br>
            Please add your Arena personal access token to <code>config.js</code>.<br>
            Get your token from: <a href="https://www.are.na/settings/personal-access-tokens" target="_blank">Arena Settings</a>
        `;
        document.getElementById('loading').style.display = 'none';
        return;
    }
    
    if (!CONFIG.channelSlug || CONFIG.channelSlug === 'your-channel-slug') {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').innerHTML = `
            <strong>Channel not configured!</strong><br>
            Please add your channel slug to <code>config.js</code>
        `;
        document.getElementById('loading').style.display = 'none';
        return;
    }
    
    // Initialize Arena display
    const arena = new ArenaDisplay(CONFIG);
    await arena.init();
    
    // Setup load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            await arena.loadBlocks(arena.currentPage + 1);
        });
    }
});
