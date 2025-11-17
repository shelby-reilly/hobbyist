/**
 * PillsPhysics - Interactive physics-based pill tags
 *
 * Features:
 * - Matter.js physics with gravity, collisions, bounce, friction
 * - Cursor repel force within configurable radius
 * - Hover: scale up + damping
 * - Drag: spring-based mouse joint
 * - Click: pulse animation + callback
 * - Keyboard accessible (Tab, Space/Enter)
 * - Respects prefers-reduced-motion
 * - Responsive with resize handling
 */

window.mountPillsPhysics = function(container, options = {}) {
    const {
        tags = [],
        onTagClick = () => {},
        gravity = 1.0,
        restitution = 0.6,
        repelRadius = 180,
        repelStrength = 0.012,
        springStiffness = 0.03,
        reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } = options;

    // Check for reduced motion
    if (reducedMotion) {
        renderStaticGrid(container, tags, onTagClick);
        return { destroy: () => container.innerHTML = '' };
    }

    // Matter.js modules
    const { Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

    // Create engine
    const engine = Engine.create({
        gravity: { x: 0, y: gravity }
    });

    // Get container dimensions - use multiple fallbacks
    const bounds = container.getBoundingClientRect();
    let width = bounds.width || container.offsetWidth || 600;
    let height = bounds.height || container.offsetHeight || 350;

    // Ensure minimum dimensions
    width = Math.max(width, 300);
    height = Math.max(height, 350);

    console.log('Pills container dimensions:', {
        width,
        height,
        boundsWidth: bounds.width,
        boundsHeight: bounds.height,
        offsetWidth: container.offsetWidth,
        offsetHeight: container.offsetHeight,
        tagCount: tags.length
    });

    // Create canvas renderer
    const canvas = document.createElement('canvas');
    canvas.className = 'pills-physics-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'auto';

    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: width,
            height: height,
            wireframes: false,
            background: 'transparent',
            pixelRatio: window.devicePixelRatio || 1
        }
    });

    // Create walls
    const wallThickness = 50;
    const walls = [
        // Bottom
        Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, {
            isStatic: true,
            render: { fillStyle: 'transparent' }
        }),
        // Left
        Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
            isStatic: true,
            render: { fillStyle: 'transparent' }
        }),
        // Right
        Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, {
            isStatic: true,
            render: { fillStyle: 'transparent' }
        }),
        // Top (soft)
        Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, {
            isStatic: true,
            render: { fillStyle: 'transparent' }
        })
    ];

    Composite.add(engine.world, walls);

    // Create HTML overlay container for labels
    const labelsContainer = document.createElement('div');
    labelsContainer.className = 'pills-labels-container';
    labelsContainer.style.position = 'absolute';
    labelsContainer.style.top = '0';
    labelsContainer.style.left = '0';
    labelsContainer.style.width = '100%';
    labelsContainer.style.height = '100%';
    labelsContainer.style.pointerEvents = 'none';

    // Create pills
    const pills = tags.map((tag, index) => {
        // Measure text to size pill
        const textWidth = measureText(tag.label, tag.emoji);
        const pillWidth = textWidth + 40;
        const pillHeight = 45;
        const radius = pillHeight / 2;

        // Spread pills across the top for better initial distribution
        const spacing = width / (tags.length + 1);
        const x = spacing * (index + 1) + (Math.random() - 0.5) * 50;
        const y = -50 - Math.random() * 100 - (index * 20);

        // Create capsule body (rounded rectangle)
        const body = Bodies.rectangle(x, y, pillWidth, pillHeight, {
            chamfer: { radius: radius },
            restitution: restitution,
            friction: 0.01,
            frictionAir: 0.02,
            frictionStatic: 0.1,
            density: 0.001,
            angle: (Math.random() - 0.5) * 0.3,
            render: {
                fillStyle: tag.bg || getPillColor(index),
                strokeStyle: 'rgba(0,0,0,0.1)',
                lineWidth: 1
            }
        });

        // Create HTML label
        const label = document.createElement('div');
        label.className = 'pill-label';
        label.setAttribute('data-pill-id', tag.id);
        label.setAttribute('tabindex', '0');
        label.setAttribute('role', 'button');
        label.setAttribute('aria-label', tag.label);
        label.innerHTML = `
            ${tag.emoji ? `<span class="pill-emoji">${tag.emoji}</span>` : ''}
            <span class="pill-text">${tag.label}</span>
        `;
        label.style.position = 'absolute';
        label.style.pointerEvents = 'auto';
        label.style.cursor = 'pointer';
        label.style.userSelect = 'none';
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '0.4rem';
        label.style.padding = '0.8rem 1.5rem';
        label.style.fontSize = '1rem';
        label.style.fontWeight = '700';
        label.style.color = '#2D3748';
        label.style.willChange = 'transform';
        label.style.transition = 'none';
        label.style.backgroundColor = tag.bg || getPillColor(index);
        label.style.borderRadius = '999px';
        label.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        label.style.left = '0';
        label.style.top = '0';

        labelsContainer.appendChild(label);

        // Store references
        body.label = tag.id;
        body.plugin = {
            htmlElement: label,
            tag: tag,
            isDragging: false,
            isHovered: false,
            dampingFactor: 1,
            scale: 1
        };

        return body;
    });

    Composite.add(engine.world, pills);

    // Add to container
    container.style.position = 'relative';
    container.appendChild(canvas);
    container.appendChild(labelsContainer);

    // Create controls overlay
    const controls = createControls(engine, pills, width);
    container.appendChild(controls);

    // Mouse interaction setup
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.02,
            damping: 0.1,
            render: { visible: false }
        }
    });

    Composite.add(engine.world, mouseConstraint);

    // Track mouse position for repel force
    let mousePos = { x: -1000, y: -1000 };
    let rafThrottle = false;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mousePos.x = e.clientX - rect.left;
        mousePos.y = e.clientY - rect.top;

        if (!rafThrottle) {
            rafThrottle = true;
            requestAnimationFrame(() => {
                applyRepelForce(pills, mousePos, repelRadius, repelStrength);
                rafThrottle = false;
            });
        }
    });

    container.addEventListener('mouseleave', () => {
        mousePos = { x: -1000, y: -1000 };
    });

    // Click detection on canvas
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Find which pill was clicked
        pills.forEach(body => {
            const { x, y } = body.position;
            const label = body.plugin.htmlElement;
            const halfWidth = label.offsetWidth / 2;
            const halfHeight = label.offsetHeight / 2;

            if (clickX >= x - halfWidth && clickX <= x + halfWidth &&
                clickY >= y - halfHeight && clickY <= y + halfHeight) {
                pulsePill(body);
                onTagClick(body.label);
            }
        });
    });

    // Hover detection on canvas
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const hoverX = e.clientX - rect.left;
        const hoverY = e.clientY - rect.top;

        pills.forEach(body => {
            const { x, y } = body.position;
            const label = body.plugin.htmlElement;
            const halfWidth = label.offsetWidth / 2;
            const halfHeight = label.offsetHeight / 2;

            const isOver = hoverX >= x - halfWidth && hoverX <= x + halfWidth &&
                          hoverY >= y - halfHeight && hoverY <= y + halfHeight;

            if (isOver && !body.plugin.isHovered) {
                body.plugin.isHovered = true;
                body.plugin.dampingFactor = 0.3;
                body.plugin.scale = 1.1;
                canvas.style.cursor = 'pointer';
            } else if (!isOver && body.plugin.isHovered) {
                body.plugin.isHovered = false;
                body.plugin.dampingFactor = 1;
                body.plugin.scale = 1;
            }
        });

        // Reset cursor if not hovering any pill
        const anyHovered = pills.some(b => b.plugin.isHovered);
        if (!anyHovered) {
            canvas.style.cursor = 'default';
        }
    });

    // Keyboard support for labels
    pills.forEach(body => {
        const label = body.plugin.htmlElement;
        label.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                pulsePill(body);
                onTagClick(body.label);
            }
        });
    });

    // Drag detection
    Events.on(mouseConstraint, 'startdrag', (event) => {
        const body = event.body;
        if (body.plugin) {
            body.plugin.isDragging = true;
        }
    });

    Events.on(mouseConstraint, 'enddrag', (event) => {
        const body = event.body;
        if (body.plugin) {
            body.plugin.isDragging = false;
        }
    });

    // Animation loop
    let animationFrameId;
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    function animate() {
        // Sync HTML labels with physics bodies
        pills.forEach(body => {
            const label = body.plugin.htmlElement;
            const { x, y } = body.position;
            const angle = body.angle;

            // Apply damping if hovered
            if (body.plugin.isHovered || body.plugin.isDragging) {
                Body.setVelocity(body, {
                    x: body.velocity.x * body.plugin.dampingFactor,
                    y: body.velocity.y * body.plugin.dampingFactor
                });
                Body.setAngularVelocity(body, body.angularVelocity * body.plugin.dampingFactor);
            }

            // Transform label to match body
            const scale = body.plugin.scale || 1;
            const centerX = x - (label.offsetWidth / 2);
            const centerY = y - (label.offsetHeight / 2);
            label.style.transform = `translate(${centerX}px, ${centerY}px) rotate(${angle}rad) scale(${scale})`;
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newBounds = container.getBoundingClientRect();
            const newWidth = newBounds.width;
            const newHeight = Math.max(newBounds.height, 300);

            // Update renderer
            render.canvas.width = newWidth * (window.devicePixelRatio || 1);
            render.canvas.height = newHeight * (window.devicePixelRatio || 1);
            render.options.width = newWidth;
            render.options.height = newHeight;

            // Update walls
            Composite.remove(engine.world, walls);
            walls[0] = Bodies.rectangle(newWidth / 2, newHeight + wallThickness / 2, newWidth, wallThickness, { isStatic: true, render: { fillStyle: 'transparent' } });
            walls[1] = Bodies.rectangle(-wallThickness / 2, newHeight / 2, wallThickness, newHeight, { isStatic: true, render: { fillStyle: 'transparent' } });
            walls[2] = Bodies.rectangle(newWidth + wallThickness / 2, newHeight / 2, wallThickness, newHeight, { isStatic: true, render: { fillStyle: 'transparent' } });
            walls[3] = Bodies.rectangle(newWidth / 2, -wallThickness / 2, newWidth, wallThickness, { isStatic: true, render: { fillStyle: 'transparent' } });
            Composite.add(engine.world, walls);

            // Clamp pills to new bounds
            pills.forEach(body => {
                const { x, y } = body.position;
                const clampedX = Math.max(50, Math.min(newWidth - 50, x));
                const clampedY = Math.max(50, Math.min(newHeight - 50, y));
                Body.setPosition(body, { x: clampedX, y: clampedY });
            });
        }, 250);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup function
    function destroy() {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        Runner.stop(runner);
        Render.stop(render);
        Engine.clear(engine);
        container.innerHTML = '';
    }

    return { destroy, pills, engine };
}

// Helper: Apply repel force
function applyRepelForce(pills, mousePos, radius, strength) {
    pills.forEach(body => {
        const { x, y } = body.position;
        const dx = x - mousePos.x;
        const dy = y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius && dist > 0) {
            const force = (radius - dist) / radius;
            const fx = (dx / dist) * force * strength;
            const fy = (dy / dist) * force * strength;
            Matter.Body.applyForce(body, body.position, { x: fx, y: fy });
        }
    });
}

// Helper: Pulse animation
function pulsePill(body) {
    // Animate scale through plugin property
    body.plugin.scale = 1.3;
    setTimeout(() => {
        body.plugin.scale = body.plugin.isHovered ? 1.1 : 1;
    }, 150);

    // Add impulse
    const impulse = { x: (Math.random() - 0.5) * 0.05, y: -0.05 };
    Matter.Body.applyForce(body, body.position, impulse);
}

// Helper: Measure text width
function measureText(text, emoji) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '700 16px "Prompt", sans-serif';
    const textWidth = ctx.measureText(text).width;
    const emojiWidth = emoji ? 20 : 0;
    return textWidth + emojiWidth + 10;
}

// Helper: Get pill color
function getPillColor(index) {
    const colors = [
        '#5DCB83', // green
        '#FFD966', // yellow
        '#E0B3FF', // purple
        '#FFB3D9', // pink
        '#89CFF0'  // blue
    ];
    return colors[index % colors.length];
}

// Helper: Create controls
function createControls(engine, pills, width) {
    const controls = document.createElement('div');
    controls.className = 'pills-controls';
    controls.style.position = 'absolute';
    controls.style.top = '1rem';
    controls.style.right = '1rem';
    controls.style.display = 'flex';
    controls.style.gap = '0.5rem';
    controls.style.zIndex = '10';

    // Freeze button
    const freezeBtn = document.createElement('button');
    freezeBtn.className = 'pills-control-btn';
    freezeBtn.textContent = '❄️';
    freezeBtn.title = 'Freeze/Unfreeze';
    freezeBtn.style.background = 'rgba(255,255,255,0.9)';
    freezeBtn.style.border = 'none';
    freezeBtn.style.borderRadius = '50%';
    freezeBtn.style.width = '40px';
    freezeBtn.style.height = '40px';
    freezeBtn.style.cursor = 'pointer';
    freezeBtn.style.fontSize = '1.2rem';
    freezeBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    freezeBtn.style.transition = 'transform 0.2s';

    let frozen = false;
    freezeBtn.addEventListener('click', () => {
        frozen = !frozen;
        engine.timing.timeScale = frozen ? 0 : 1;
        freezeBtn.textContent = frozen ? '▶️' : '❄️';
    });

    freezeBtn.addEventListener('mouseenter', () => {
        freezeBtn.style.transform = 'scale(1.1)';
    });
    freezeBtn.addEventListener('mouseleave', () => {
        freezeBtn.style.transform = 'scale(1)';
    });

    // Shuffle button
    const shuffleBtn = document.createElement('button');
    shuffleBtn.className = 'pills-control-btn';
    shuffleBtn.textContent = '🔀';
    shuffleBtn.title = 'Shuffle';
    shuffleBtn.style.background = 'rgba(255,255,255,0.9)';
    shuffleBtn.style.border = 'none';
    shuffleBtn.style.borderRadius = '50%';
    shuffleBtn.style.width = '40px';
    shuffleBtn.style.height = '40px';
    shuffleBtn.style.cursor = 'pointer';
    shuffleBtn.style.fontSize = '1.2rem';
    shuffleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    shuffleBtn.style.transition = 'transform 0.2s';

    shuffleBtn.addEventListener('click', () => {
        pills.forEach(body => {
            const randomVelX = (Math.random() - 0.5) * 10;
            const randomVelY = (Math.random() - 0.5) * 10;
            const randomAngVel = (Math.random() - 0.5) * 0.2;
            Matter.Body.setVelocity(body, { x: randomVelX, y: randomVelY });
            Matter.Body.setAngularVelocity(body, randomAngVel);
        });
    });

    shuffleBtn.addEventListener('mouseenter', () => {
        shuffleBtn.style.transform = 'scale(1.1)';
    });
    shuffleBtn.addEventListener('mouseleave', () => {
        shuffleBtn.style.transform = 'scale(1)';
    });

    controls.appendChild(freezeBtn);
    controls.appendChild(shuffleBtn);

    return controls;
}

// Fallback: Static grid for reduced motion
function renderStaticGrid(container, tags, onTagClick) {
    container.classList.add('pills-static-grid');
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, auto))';
    grid.style.gap = '1rem';
    grid.style.justifyContent = 'center';
    grid.style.padding = '2rem';

    tags.forEach((tag, index) => {
        const pill = document.createElement('button');
        pill.className = 'pill-static';
        pill.setAttribute('data-pill-id', tag.id);
        pill.innerHTML = `
            ${tag.emoji ? `<span class="pill-emoji">${tag.emoji}</span>` : ''}
            <span class="pill-text">${tag.label}</span>
        `;
        pill.style.display = 'inline-flex';
        pill.style.alignItems = 'center';
        pill.style.gap = '0.4rem';
        pill.style.padding = '0.8rem 1.5rem';
        pill.style.border = 'none';
        pill.style.borderRadius = '999px';
        pill.style.fontSize = '1rem';
        pill.style.fontWeight = '700';
        pill.style.color = '#2D3748';
        pill.style.background = tag.bg || getPillColor(index);
        pill.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        pill.style.cursor = 'pointer';
        pill.style.fontFamily = '"Prompt", sans-serif';
        pill.style.transition = 'transform 0.2s, box-shadow 0.2s';

        pill.addEventListener('click', () => onTagClick(tag.id));
        pill.addEventListener('mouseenter', () => {
            pill.style.transform = 'scale(1.05)';
            pill.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
        });
        pill.addEventListener('mouseleave', () => {
            pill.style.transform = 'scale(1)';
            pill.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });

        grid.appendChild(pill);
    });

    container.appendChild(grid);
}
