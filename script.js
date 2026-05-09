/* ============================================
   PANEL DE CONTROL NORMAL - INTERACTIVIDAD
   Funciones para dashboard profesional
   ============================================ */

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    
    // === 1. SIDEBAR TOGGLE (colapsar/expandir) ===
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Guardar estado en localStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
        
        // Recuperar estado guardado
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
        }
    }
    
    // === 2. RESPONSIVE: cerrar sidebar en móvil al hacer clic en enlace ===
    const navItems = document.querySelectorAll('.nav-item');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (sidebar && sidebar.classList.contains('mobile-open')) {
                    sidebar.classList.remove('mobile-open');
                }
            });
        });
    }
    
    // === 3. KPI CARDS - Actualización dinámica de valores ===
    function fetchKpiData() {
        // Simular llamada a API
        const randomValues = {
            ingresos: Math.floor(Math.random() * 50000) + 10000,
            usuarios: Math.floor(Math.random() * 1000) + 200,
            conversiones: (Math.random() * 15 + 2).toFixed(1),
            tickets: Math.floor(Math.random() * 50) + 5
        };
        
        // Actualizar DOM si existen los elementos
        const kpiIngresos = document.querySelector('.kpi-card:first-child .kpi-value');
        const kpiUsuarios = document.querySelector('.kpi-card:nth-child(2) .kpi-value');
        const kpiConversiones = document.querySelector('.kpi-card:nth-child(3) .kpi-value');
        const kpiTickets = document.querySelector('.kpi-card:nth-child(4) .kpi-value');
        
        if (kpiIngresos) kpiIngresos.textContent = `$${randomValues.ingresos.toLocaleString()}`;
        if (kpiUsuarios) kpiUsuarios.textContent = randomValues.usuarios.toLocaleString();
        if (kpiConversiones) kpiConversiones.textContent = `${randomValues.conversiones}%`;
        if (kpiTickets) kpiTickets.textContent = randomValues.tickets;
    }
    
    // Actualizar cada 30 segundos (opcional)
    // setInterval(fetchKpiData, 30000);
    
    // === 4. GRÁFICOS SIMULADOS con Chart.js (si existe la librería) ===
    function initCharts() {
        // Verificar si Chart.js está disponible
        if (typeof Chart === 'undefined') {
            console.log('Chart.js no cargado - omitiendo gráficos');
            return;
        }
        
        // Gráfico de líneas - Ventas mensuales
        const ctxLine = document.getElementById('salesChart')?.getContext('2d');
        if (ctxLine) {
            new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Ventas 2024',
                        data: [12000, 19000, 15000, 22000, 28000, 25000],
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' }
                    }
                }
            });
        }
        
        // Gráfico de barras - Usuarios por mes
        const ctxBar = document.getElementById('usersChart')?.getContext('2d');
        if (ctxBar) {
            new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Nuevos usuarios',
                        data: [65, 78, 92, 88, 104, 121],
                        backgroundColor: '#10b981',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }
    
    initCharts();
    
    // === 5. TABLA DINÁMICA - Búsqueda en tiempo real ===
    const searchInput = document.querySelector('.table-search');
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    // === 6. FILTROS POR ESTADO ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const status = this.getAttribute('data-status');
            
            // Actualizar UI del botón activo
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar filas
            tableRows.forEach(row => {
                const statusBadge = row.querySelector('.status');
                if (!statusBadge) return;
                
                if (status === 'all' || statusBadge.textContent.toLowerCase() === status) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
    
    // === 7. NOTIFICACIONES ===
    const notifBtn = document.querySelector('.notification-btn');
    let notificationCount = 3;
    
    if (notifBtn) {
        notifBtn.addEventListener('click', function() {
            alert(`📬 Tienes ${notificationCount} notificaciones sin leer`);
            
            // Resetear badge
            const badge = this.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
                notificationCount = 0;
            }
        });
    }
    
    // === 8. TOOLTIPS AUTOMÁTICOS ===
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipDiv = document.createElement('div');
            tooltipDiv.className = 'custom-tooltip';
            tooltipDiv.textContent = tooltipText;
            tooltipDiv.style.cssText = `
                position: absolute;
                background: #1f2937;
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 0.375rem;
                font-size: 0.75rem;
                z-index: 1000;
                white-space: nowrap;
            `;
            document.body.appendChild(tooltipDiv);
            
            const rect = this.getBoundingClientRect();
            tooltipDiv.style.top = `${rect.top - 30 + window.scrollY}px`;
            tooltipDiv.style.left = `${rect.left + (rect.width / 2) - (tooltipDiv.offsetWidth / 2)}px`;
            
            this.addEventListener('mouseleave', () => tooltipDiv.remove(), { once: true });
        });
    });
    
    // === 9. ACTUALIZAR RELOJ EN TIEMPO REAL ===
    function updateClock() {
        const clockElement = document.querySelector('.live-clock');
        if (clockElement) {
            const now = new Date();
            const formatted = now.toLocaleTimeString('es-ES', { hour12: false });
            clockElement.textContent = formatted;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();
    
    // === 10. MANEJO DE ERRORES GLOBAL ===
    window.addEventListener('error', function(e) {
        console.error('Error capturado:', e.message);
        // Opcional: mostrar notificación amigable al usuario
    });
    
    console.log('✅ Panel normal inicializado correctamente');
});

// === FUNCIONES AUXILIARES EXPORTABLES ===

// Exportar datos de tabla a CSV
function exportToCSV() {
    const rows = document.querySelectorAll('.data-table tbody tr');
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados
    const headers = document.querySelectorAll('.data-table th');
    const headerText = Array.from(headers).map(h => h.textContent).join(',');
    csvContent += headerText + "\r\n";
    
    // Datos
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowText = Array.from(cells).map(cell => `"${cell.textContent.replace(/"/g, '""')}"`).join(',');
        csvContent += rowText + "\r\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dashboard_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Recargar datos desde API (placeholder)
async function refreshDashboardData() {
    try {
        const response = await fetch('/api/dashboard-data');
        const data = await response.json();
        // Actualizar UI con los datos recibidos
        console.log('Datos actualizados:', data);
    } catch (error) {
        console.error('Error al refrescar:', error);
    }
}