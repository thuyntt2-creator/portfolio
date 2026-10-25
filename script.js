/**
 * NGUYỄN THỊ THANH THỦY — PORTFOLIO INTERACTION ENGINE
 * Features:
 * 1. Interactive Logistics Sorting Canvas (Hero Data Packets)
 * 2. Case Studies Dynamic Previewer & Deep Modal
 * 3. Interactive Career Journey Path (SVG Nodes)
 * 4. Control Tower Live Simulator (Interactive Terminal & Telegram Bot Alert)
 * 5. 1-Click Clipboard Copy & CV Modal Controller
 * 6. Live Ticker Animation
 * 7. Web Audio Engine & Lo-Fi Ambient Radio
 * 8. GHN Highway Transit & Vehicle Simulation (Truck & Scooter)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initCaseStudies();
  initCareerJourney();
  initSimulator();
  initContactAndModals();
  initLiveTicker();
  initAudioEngine();
  initGhnHighway();
});

/* ==========================================================================
   1. HERO INTERACTIVE LOGISTICS SORTING CANVAS
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const meterBar = document.getElementById('meterBar');
  const meterValue = document.getElementById('meterValue');
  const btnSortNow = document.getElementById('btnSortNow');
  const canvasHint = document.getElementById('canvasHint');

  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    recalcTargets();
  });

  const TOTAL_NODES = 42;
  const nodes = [];
  let isSorted = false;
  let sortProgress = 0.28; // 28% initial
  let targetProgress = 0.28;

  // Generate random data points
  for (let i = 0; i < TOTAL_NODES; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      targetX: 0,
      targetY: 0,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 4 + 3,
      color: Math.random() > 0.4 ? '#d4f236' : (Math.random() > 0.5 ? '#06b6d4' : '#10b981'),
      label: 'MVD-' + Math.floor(1000 + Math.random() * 9000),
      colIndex: i % 7,
      rowRank: Math.floor(i / 7)
    });
  }

  function recalcTargets() {
    const colCount = 7;
    const colWidth = Math.min(100, (width * 0.7) / colCount);
    const startX = width * 0.35;
    const baseY = height * 0.65;

    nodes.forEach((n) => {
      // Form structured bar columns
      n.targetX = startX + n.colIndex * (colWidth + 12);
      n.targetY = baseY - n.rowRank * 16;
    });
  }
  recalcTargets();

  // Mouse interaction
  let mouse = { x: -1000, y: -1000, active: false };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;

    // Slightly increase sorting on hover
    if (targetProgress < 0.95) {
      targetProgress = Math.min(0.95, targetProgress + 0.015);
      if (canvasHint) canvasHint.style.opacity = '0';
    }
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  if (btnSortNow) {
    btnSortNow.addEventListener('click', () => {
      isSorted = !isSorted;
      targetProgress = isSorted ? 1.0 : 0.35;
      btnSortNow.innerHTML = isSorted 
        ? `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"></path></svg> 100% Đã chuẩn hóa`
        : `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16v-4M8 16V9M12 16V6M16 16V3"></path></svg> Tự động chuẩn hóa`;
    });
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth progress interpolation
    sortProgress += (targetProgress - sortProgress) * 0.08;
    if (meterBar) meterBar.style.width = Math.round(sortProgress * 100) + '%';
    if (meterValue) meterValue.textContent = Math.round(sortProgress * 100) + '% Chuẩn hóa & Điều phối';

    // Draw connection lines if sorted
    if (sortProgress > 0.4) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(212, 242, 54, ${sortProgress * 0.15})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length - 1; i += 2) {
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
      }
      ctx.stroke();
    }

    // Update & draw nodes
    nodes.forEach((n) => {
      if (sortProgress < 0.99) {
        // Natural float
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 10 || n.x > width - 10) n.vx *= -1;
        if (n.y < 10 || n.y > height - 10) n.vy *= -1;
      }

      // Magnetic pull to sorted column position
      n.x += (n.targetX - n.x) * (sortProgress * 0.1);
      n.y += (n.targetY - n.y) * (sortProgress * 0.1);

      // Mouse repulsion
      if (mouse.active) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          n.x += (dx / dist) * force * 6;
          n.y += (dy / dist) * force * 6;
        }
      }

      // Draw node glow & dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = n.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. FEATURED CASE STUDIES DATA & DYNAMIC PREVIEW
   ========================================================================== */
const CASE_DATA = {
  1: {
    id: 'NTB-CTRL-01',
    badge: 'CASE 01 · FLAGSHIP SYSTEM · LIVE WEB APP',
    title: 'Hệ Sinh Thái NTB Operations Control Tower & Ops Dashboard',
    role: 'Trợ lý Giám Đốc Vùng · Web App Vercel & Data Pipeline & MCP AI · Production',
    desc: 'Hệ sinh thái do Thủy tự tay thiết kế & phát triển từ A-Z: Full-stack Web App (namtrungbo.vercel.app) kết hợp Data Pipeline tự động hóa 5 tỉnh Nam Trung Bộ. Đặc biệt tiên phong tích hợp cổng giao thức Model Context Protocol (MCP) cho phép Ban Giám đốc kết nối Trợ lý AI (Claude Desktop, Cursor) để truy vấn số liệu bằng tiếng Việt tự nhiên.',
    metrics: [
      { val: '14+ Modules', lbl: 'Giám sát vận hành chuyên sâu' },
      { val: '27 AMs', lbl: 'Quản trị 85 bưu cục tại 5 tỉnh' },
      { val: 'MCP Protocol', lbl: 'Cổng tích hợp Trợ lý AI thông minh' }
    ],
    tech: ['Production: namtrungbo.vercel.app', 'Model Context Protocol (MCP)', 'Python 3.11', 'Telegram Bot API', 'Google Sheets Engine', 'Pandas Analytics'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-lime); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#10b981; border-radius:50%; box-shadow:0 0 8px #10b981;"></span>
          LIVE PRODUCTION: namtrungbo.vercel.app
        </span>
        <a href="https://namtrungbo.vercel.app/" target="_blank" rel="noopener noreferrer" style="font-family:var(--font-mono); font-size:0.72rem; color:var(--accent-lime); text-decoration:underline;">Mở trang web ↗</a>
      </div>
      <div style="background:rgba(255,255,255,0.04); border-radius:8px; padding:12px; display:grid; grid-template-columns:repeat(4,1fr); gap:8px; text-align:center;">
        <div><div style="color:var(--accent-emerald); font-weight:700; font-size:1.05rem;">5 Tỉnh</div><div style="font-size:0.65rem; color:#888;">LÂM ĐỒNG - KHÁNH HÒA...</div></div>
        <div><div style="color:var(--accent-lime); font-weight:700; font-size:1.05rem;">L7D %GTC</div><div style="font-size:0.65rem; color:#888;">BƯU CỤC BẤT ỔN</div></div>
        <div><div style="color:var(--accent-cyan); font-weight:700; font-size:1.05rem;">>10kg</div><div style="font-size:0.65rem; color:#888;">ĐỐI SÁNH HÀNG NẶNG</div></div>
        <div><div style="color:var(--accent-amber); font-weight:700; font-size:1.05rem;">MCP AI</div><div style="font-size:0.65rem; color:#888;">CLAUDE / CURSOR</div></div>
      </div>
      <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.72rem; color:var(--text-dim);">✓ 14 Modules vận hành & đồng bộ Sheets</span>
        <a href="https://namtrungbo.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding:6px 14px; font-size:0.76rem; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
          <span>Xem Live App</span>
          <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 15 15 5M5 5h10v10"></path></svg>
        </a>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <div style="background:rgba(243,101,35,0.1); border:1px solid rgba(243,101,35,0.4); border-radius:8px; padding:16px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="color:#ff8b4d; font-weight:700; font-size:0.92rem; display:flex; align-items:center; gap:8px;">
              <span style="width:8px; height:8px; background:#10b981; border-radius:50%; box-shadow:0 0 8px #10b981;"></span>
              🚀 SẢN PHẨM SẢN XUẤT THỰC TẾ ĐANG VẬN HÀNH (LIVE PRODUCTION)
            </div>
            <div style="color:var(--text-muted); font-size:0.82rem; margin-top:4px;">Web App phục vụ Ban Giám đốc Vùng & 27 AMs điều hành 85 bưu cục tại 5 tỉnh Nam Trung Bộ hàng ngày.</div>
          </div>
          <a href="https://namtrungbo.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding:9px 18px; font-size:0.84rem; text-decoration:none; white-space:nowrap;">
            Mở Live Dashboard ↗
          </a>
        </div>
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">Toàn vùng NTB gồm 5 tỉnh với địa bàn trải rộng từ cao nguyên (Lâm Đồng, Đắk Nông) đến duyên hải (Khánh Hòa, Ninh Thuận, Bình Thuận). Hằng ngày, Ban Giám đốc và 27 Account Manager (AM) quản lý 85 bưu cục phải tổng hợp thủ công hàng chục file dữ liệu rời rạc từ hệ thống. Việc này làm chậm trễ quyết định can thiệp đến tận 11h trưa — khi ca giao sáng gần như đã chốt sổ.</p>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">🔍 Giải pháp: Hệ Thống GHN Ops Dashboard (namtrungbo.vercel.app)</h4>
        <p class="m-text">Thủy trực tiếp thiết kế và lập trình hoàn chỉnh một nền tảng Web Dashboard tập trung hóa với hơn 14 module chức năng chuyên sâu:</p>
        <ul class="m-list">
          <li><strong>Giám sát Bưu cục bất ổn:</strong> Tự động tính toán %GTC trung bình 7 ngày gần nhất (L7D) kết hợp lượng hàng tồn và hàng mới, tự động phát hiện và cảnh báo bưu cục tụt giảm quá 30% so với mốc lịch sử.</li>
          <li><strong>Xu hướng Đối sánh Đơn tạo vs Hàng nặng >10kg:</strong> Bắt kịp các đợt bùng nổ sản lượng hàng cồng kềnh để cảnh báo tải trọng xe trung chuyển liên tỉnh.</li>
          <li><strong>Phân tích luồng sàn TMĐT (%FD Channel Breakdown):</strong> Theo dõi tỷ lệ giao thất bại / hoàn trả chia theo từng đối tác Shopee, TikTok Shop, Lazada và hàng ngoài sàn.</li>
          <li><strong>Kiểm soát Backlog & Năng suất NVPTTT Real-time:</strong> Cập nhật liên tục tiến độ lấy và giao hàng của nhân viên theo từng ca làm việc.</li>
          <li><strong>Đột phá: Cổng kết nối Trợ lý AI qua Giao thức MCP (Model Context Protocol):</strong> Cho phép Giám đốc Vùng cấu hình kết nối trực tiếp dữ liệu với Claude Desktop hoặc Cursor IDE, chat hỏi đáp tự nhiên ("Bưu cục nào của AM Trần Văn Phước đang bất ổn?") mà không cần mở bảng số liệu!</li>
        </ul>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">💰 Tác động & Giá trị đem lại cho Doanh nghiệp</h4>
        <p class="m-text">Không chỉ là báo cáo tĩnh, hệ thống đã trở thành công cụ làm việc hàng ngày của Giám đốc Vùng và 27 AMs. Giảm 85% thời gian tổng hợp số liệu, giải phóng hàng trăm giờ làm việc mỗi tháng và nâng cao độ nhạy bén trong can thiệp vận hành tức thì.</p>
      </div>
    `
  },
  2: {
    id: 'NTB-BOT-5MOC',
    badge: 'CASE 02 · 5-TIME PULSE BOT',
    title: 'Hệ Thống Bot Điểm Danh Báo Cáo 5 Mốc Vận Hành Toàn Vùng',
    role: 'Tự động hóa Báo cáo Điều hành · Telegram Bot & Google Sheets API · 2026',
    desc: 'Xây dựng bot Telegram tự động hóa toàn diện quy trình điểm danh quân số và thu thập báo cáo tiến độ theo 5 khung giờ mốc then chốt trong ngày (07h30, 10h00, 12h00, 15h30, 19h00) cho 85 bưu cục trên 5 tỉnh. Bot tự động bóc tách số liệu, phát hiện và ping nhắc nhở đích danh bưu cục chưa chốt số.',
    metrics: [
      { val: '5 Mốc/Ngày', lbl: 'Khung giờ chốt dữ liệu vàng' },
      { val: '85 Bưu Cục', lbl: 'Đồng bộ báo cáo tự động' },
      { val: '100% On-time', lbl: 'Triệt tiêu tình trạng trễ báo cáo' }
    ],
    tech: ['Telegram Bot API', 'Google Sheets API', 'Python Automation', 'Linux Cron VPS', 'Data Aggregation Engine'],
    visualHtml: `
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-lime); margin-bottom:8px;">5 MỐC BÁO CÁO VẬN HÀNH TIÊU CHUẨN:</div>
      <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:4px; text-align:center; margin-bottom:10px;">
        <div style="background:rgba(255,255,255,0.05); padding:6px 2px; border-radius:4px;"><div style="color:var(--accent-lime); font-size:0.72rem; font-weight:700;">07h30</div><div style="font-size:0.6rem; color:#888;">Quân số</div></div>
        <div style="background:rgba(255,255,255,0.05); padding:6px 2px; border-radius:4px;"><div style="color:var(--accent-cyan); font-size:0.72rem; font-weight:700;">10h00</div><div style="font-size:0.6rem; color:#888;">Xuất kho</div></div>
        <div style="background:rgba(255,255,255,0.05); padding:6px 2px; border-radius:4px;"><div style="color:var(--accent-emerald); font-size:0.72rem; font-weight:700;">12h00</div><div style="font-size:0.6rem; color:#888;">Chốt ca 1</div></div>
        <div style="background:rgba(255,255,255,0.05); padding:6px 2px; border-radius:4px;"><div style="color:var(--accent-amber); font-size:0.72rem; font-weight:700;">15h30</div><div style="font-size:0.6rem; color:#888;">Tải ca 2</div></div>
        <div style="background:rgba(255,255,255,0.05); padding:6px 2px; border-radius:4px;"><div style="color:#f36523; font-size:0.72rem; font-weight:700;">19h00</div><div style="font-size:0.6rem; color:#888;">Chốt ngày</div></div>
      </div>
      <div style="font-size:0.74rem; color:var(--accent-emerald);">✓ Tự động ping nhắc nhở đích danh bưu cục chưa báo cáo</div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">Với quy mô 85 bưu cục trải rộng trên 5 tỉnh (Khánh Hòa, Lâm Đồng, Đắk Nông, Bình Thuận, Ninh Thuận), việc thu thập báo cáo thủ công qua tin nhắn rải rác thường xuyên bị sót, trễ hẹn và mất hàng giờ để tổng hợp. Ban Giám đốc và 27 AM không nắm được tiến độ ca theo thời gian thực để can thiệp kịp thời.</p>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">🔍 Giải pháp & Kiến trúc Bot</h4>
        <ul class="m-list">
          <li><strong>Chuẩn hóa 5 Mốc Vàng:</strong> Cố định 5 khung giờ điểm danh & chốt dữ liệu then chốt: Mốc 1 (07h30 mở ca & quân số), Mốc 2 (10h00 xuất kho ca 1), Mốc 3 (12h00 chốt tiến độ ca sáng), Mốc 4 (15h30 nhận tải & xuất kho ca chiều), Mốc 5 (19h00 chốt toàn ca & COD nộp ví).</li>
          <li><strong>Cơ chế tự động bóc tách & nhắc nhở:</strong> Đúng giờ mốc, Bot tự động mở cổng tiếp nhận. Đến trước giờ chốt 10 phút, Bot quét danh sách 85 bưu cục, tự động gắn thẻ (mention) đích danh AM/Trưởng bưu cục chưa nộp.</li>
          <li><strong>Đồng bộ Real-time:</strong> Bóc tách dữ liệu tin nhắn thành các trường thông tin chuẩn, tự động đẩy về Google Sheets tổng hợp toàn vùng và thông báo vào nhóm điều hành.</li>
        </ul>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">💰 Tác động kinh doanh (Measurable Business Impact)</h4>
        <p class="m-text">100% bưu cục tuân thủ báo cáo đúng giờ. Tiết kiệm 90% thời gian tổng hợp số liệu cho trợ lý vùng và giúp Giám đốc Vùng có bức tranh vận hành liên tục không gián đoạn.</p>
      </div>
    `
  },
  3: {
    id: 'NTB-KAIZEN-5S',
    badge: 'CASE 03 · KAIZEN 5S BOT',
    title: 'Bot Điểm Danh Kaizen — Kỷ Luật Vệ Sinh Kho & Layout Bưu Cục',
    role: 'Kỷ luật vận hành & Tiêu chuẩn 5S Kho bãi · Telegram Photo Check-in · 2026',
    desc: 'Hệ thống bot Telegram giám sát kỷ luật 5S và tiêu chuẩn layout kho bãi tại 85 bưu cục: Yêu cầu check-in hình ảnh thực tế mỗi ngày, kiểm soát lối thoát hiểm thông thoáng, phân khu hàng cồng kềnh (>10kg) và hàng hoàn ngăn nắp, triệt tiêu tối đa nguy cơ dập vỡ, thất lạc hàng hóa.',
    metrics: [
      { val: '85 Bưu Cục', lbl: 'Check-in hình ảnh Kaizen mỗi ngày' },
      { val: '5S Chuẩn', lbl: 'Giữ gìn vệ sinh & layout ngăn nắp' },
      { val: '0 Sự Cố', lbl: 'Ngăn ngừa bể vỡ do sai layout' }
    ],
    tech: ['Telegram Photo Upload', '5S Audit Matrix', 'Image Verification', 'Google Sheets Dashboard', 'Daily Compliance Tracker'],
    visualHtml: `
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;">TIÊU CHÍ CHECK-IN KAIZEN 5S BƯU CỤC HÀNG NGÀY:</div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        <div style="display:flex; justify-content:space-between; font-size:0.75rem;">
          <span>📸 Phân khu layout (Hàng giao / Hàng hoàn):</span>
          <span style="color:var(--accent-emerald);">Đạt chuẩn 5S</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem;">
          <span>🧹 Vệ sinh sàn bãi & bàn chia chọn:</span>
          <span style="color:var(--accent-lime);">Sạch sẽ, không rác</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem;">
          <span>🚪 Lối thoát hiểm & cửa xuất nhập tải:</span>
          <span style="color:var(--accent-emerald);">100% Thông thoáng</span>
        </div>
      </div>
      <div style="margin-top:8px; font-size:0.72rem; color:var(--accent-lime);">➔ Bot chấm điểm & cảnh báo tức thì bưu cục vi phạm layout</div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">Tại các bưu cục có sản lượng lớn, kho bãi dễ rơi vào tình trạng bừa bộn sau mỗi đợt nhận tải; hàng cồng kềnh >10kg để tràn ra lối đi, hàng hoàn và hàng giao lẫn lộn dẫn đến việc bưu tá lấy nhầm hàng, nguy cơ dập vỡ hàng hóa cao và vi phạm an toàn phòng cháy chữa cháy.</p>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">🔍 Giải pháp & Quy trình Bot Kaizen</h4>
        <ul class="m-list">
          <li><strong>Bắt buộc Check-in hình ảnh thực tế:</strong> Mỗi ngày bưu cục phải gửi ảnh chụp góc rộng toàn cảnh kho, khu vực chia chọn và lối đi chính vào khung giờ quy định.</li>
          <li><strong>Bộ tiêu chí đánh giá Kaizen 5S:</strong> Sàng lọc (loại bỏ bao bì rác), Sắp xếp (phân khu hàng nặng, hàng dễ vỡ, hàng giá trị cao riêng biệt), Sạch sẽ (sàn kho khô ráo), Săn sóc và Sẵn sàng.</li>
          <li><strong>Cảnh báo & Chấn chỉnh tức thì:</strong> Bưu cục nào không gửi ảnh hoặc để kho bừa bộn sẽ bị Bot gửi thông báo lên nhóm điều hành kèm nhắc nhở AM phụ trách xuống kiểm tra xử lý trong ngày.</li>
        </ul>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">💰 Tác động kinh doanh (Measurable Business Impact)</h4>
        <p class="m-text">Xây dựng nếp văn hóa kỷ luật và tác phong công nghiệp chuyên nghiệp tại 85 bưu cục. Giảm thiểu tối đa tỷ lệ hư hại, bể vỡ hàng hóa do bảo quản sai quy cách và đảm bảo an toàn tuyệt đối cho người lao động.</p>
      </div>
    `
  },
  4: {
    id: 'NTB-FIELD-SUP',
    badge: 'CASE 04 · FIELD OPS BOT',
    title: 'Bot Check-in Đi Thị Trường Cho HRBP & Giám Sát Vận Hành (SUP)',
    role: 'Quản trị nhân sự & Giám sát thực địa · Telegram Geo Check-in · 2026',
    desc: 'Số hóa toàn diện lịch trình công tác thực địa của đội ngũ HRBP (Nhân sự) và Supervisor (Giám sát vận hành): Check-in vị trí thực tế tại bưu cục bằng GPS, ghi nhận biên bản đánh giá chất lượng nhân sự, an ninh và cơ sở vật chất ngay tại hiện trường về Google Sheets thời gian thực.',
    metrics: [
      { val: 'Real-time', lbl: 'Định vị GPS check-in thực tế' },
      { val: '100% Số Hóa', lbl: 'Biên bản kiểm tra bưu cục' },
      { val: '5 Tỉnh NTB', lbl: 'Minh bạch lịch trình công tác' }
    ],
    tech: ['Telegram Geolocation', 'Mobile Form Workflow', 'HRBP & SUP Tracker', 'Real-time Logs', 'Google Sheets Integration'],
    visualHtml: `
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;">NHẬT KÝ CHECK-IN THỊ TRƯỜNG HRBP / SUP:</div>
      <div style="background:rgba(255,255,255,0.04); border-radius:8px; padding:10px; font-size:0.75rem; line-height:1.5;">
        <div>📍 <strong>SUP Nguyễn Văn B</strong> check-in: <em>Bưu cục Cam Ranh (Khánh Hòa)</em></div>
        <div style="color:var(--accent-lime); font-size:0.72rem; margin-top:2px;">🛰️ Tọa độ GPS: Hợp lệ tại bưu cục (Lệch 0m) · 08h45 sáng</div>
        <div style="color:#aaa; font-size:0.7rem; margin-top:4px;">📝 Biên bản: Đã kiểm tra 12 bưu tá, kiểm tra camera an ninh & tác phong đồng phục.</div>
      </div>
      <div style="margin-top:8px; font-size:0.72rem; color:var(--accent-emerald);">✓ Đồng bộ trực tiếp về báo cáo quản trị Ban Giám Đốc</div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">Đội ngũ HRBP (Nhân sự đối tác) và SUP (Giám sát vận hành) thường xuyên phải di chuyển liên tục qua hàng chục bưu cục trên 5 tỉnh. Trước đây, việc quản lý lịch trình đi thị trường dựa trên báo cáo miệng hoặc tin nhắn rời rạc, thiếu dữ liệu vị trí thực tế để đo lường tần suất hỗ trợ bưu cục và chất lượng kiểm tra thực địa.</p>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">🔍 Giải pháp kỹ thuật</h4>
        <ul class="m-list">
          <li><strong>Telegram Geolocation Check-in:</strong> Khi đến bưu cục, HRBP/SUP mở bot và chia sẻ vị trí trực tiếp (Live Location). Bot đối chiếu tọa độ với cơ sở dữ liệu 85 bưu cục để xác thực người thật - việc thật.</li>
          <li><strong>Form số hóa biên bản kiểm tra:</strong> Tích hợp bộ câu hỏi nhanh ngay trên giao diện bot: Quân số bưu tá đi làm, trang thiết bị kho bãi, tác phong kỷ luật, các kiến nghị của nhân viên.</li>
          <li><strong>Báo cáo tự động về Trung tâm điều hành:</strong> Tự động cập nhật vào Dashboard để Ban Giám đốc Vùng theo dõi được hôm nay bưu cục nào đã được HRBP/SUP ghé thăm và có vấn đề gì cần chỉ đạo giải quyết.</li>
        </ul>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">💰 Tác động kinh doanh (Measurable Business Impact)</h4>
        <p class="m-text">Minh bạch 100% hoạt động đi thị trường của đội ngũ giám sát và nhân sự. Tăng cường sự kết nối giữa khối văn phòng vùng và tuyến đầu bưu cục, giải quyết nhanh các vấn đề nhân sự phát sinh ngay tại chỗ.</p>
      </div>
    `
  },
  5: {
    id: 'KA-FLOW-05',
    badge: 'CASE 05 · AWARD 2025',
    title: 'Tái Cấu Trúc Shipping Status Flow & Cắt Giảm 20% Contact Rate',
    role: 'Key Account Executive · Sàn Shopee, Lazada, TikTok Shop · 2025 – 2026',
    desc: 'Phân tích điểm nghẽn trải nghiệm người mua hàng trên các sàn TMĐT lớn, thiết kế lại luồng trạng thái đơn hàng và công cụ theo dõi tự động, đạt danh hiệu Chiến Binh Xuất Sắc 2025.',
    metrics: [
      { val: '-20%', lbl: 'Contact rate khiếu nại đơn hàng' },
      { val: '30%', lbl: 'Giảm thời gian thao tác thủ công' },
      { val: '99.2%', lbl: 'Tuân thủ cam kết SLA sàn TMĐT' }
    ],
    tech: ['Google Apps Script', 'Status Flow Architecture', 'Jira / X-Space / IH API', 'Customer Journey Mapping'],
    visualHtml: `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-amber);">🏆 GIẢI CHIẾN BINH XUẤT SẮC 2025</span>
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-emerald);">-15% ~ -20% TỶ LỆ KHIẾU NẠI</span>
      </div>
      <div style="background:rgba(255,255,255,0.04); border-radius:8px; padding:12px; font-size:0.78rem; line-height:1.5;">
        <div><strong>Cũ:</strong> "Đang luân chuyển" (Khách không rõ đơn ở đâu ➔ Gọi hotline khiếu nại)</div>
        <div style="color:var(--accent-lime); margin-top:4px;"><strong>Mới:</strong> Luồng trạng thái chia chặng chi tiết + Cảnh báo chủ động nếu có bão lũ miền Trung</div>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">Tỷ lệ liên hệ khiếu nại (Contact Rate) từ người mua hàng trên sàn TMĐT lên tới 8-10%, gây quá tải bộ phận CSKH và đối mặt nguy cơ bị sàn phạt vi phạm chất lượng dịch vụ. Phần lớn cuộc gọi bắt nguồn từ việc trạng thái đơn hàng hiển thị mập mờ.</p>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">🔍 Giải pháp thực hiện</h4>
        <ul class="m-list">
          <li><strong>Tái thiết kế luồng trạng thái (Status Flow):</strong> Chia nhỏ các mốc quét kiện tại Hub luân chuyển liên tỉnh, bổ sung thời gian dự kiến giao chi tiết theo từng khu vực.</li>
          <li><strong>Xây dựng Tool cảnh báo sớm tự động bằng Google Apps Script:</strong> Tự động lọc các đơn hàng bị tắc nghẽn quá 24h tại kho trung chuyển để xử lý ưu tiên trước khi khách hàng kịp gọi khiếu nại.</li>
          <li><strong>Phối hợp đa phòng ban:</strong> Kết nối trực tiếp giữa đội ngũ Account Manager sàn và Trung tâm vận hành Hub để giải tỏa đơn tắc.</li>
        </ul>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">💰 Tác động kinh doanh (Measurable Business Impact)</h4>
        <p class="m-text">Giảm từ 15% đến 20% contact rate khiếu nại. Bảo vệ cam kết SLA trên 99% với các đối tác chiến lược hàng đầu, được Ban Giám đốc vinh danh giải thưởng "Chiến binh xuất sắc năm 2025".</p>
      </div>
    `
  }
};

function initCaseStudies() {
  const caseItems = document.querySelectorAll('.case-item');
  const previewBadge = document.getElementById('previewBadge');
  const previewId = document.getElementById('previewId');
  const previewTitle = document.getElementById('previewTitle');
  const previewDesc = document.getElementById('previewDesc');
  const previewMetrics = document.getElementById('previewMetrics');
  const previewTech = document.getElementById('previewTech');
  const previewVisual = document.getElementById('previewVisual');
  const btnOpenDetail = document.getElementById('btnOpenDetailModal');
  const modal = document.getElementById('modalCaseDetail');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalContent = document.getElementById('modalContent');
  const btnCloseCaseModal = document.getElementById('btnCloseCaseModal');

  let currentCaseId = 1;

  function updatePreview(caseId) {
    const data = CASE_DATA[caseId];
    if (!data) return;
    currentCaseId = caseId;

    // Active item UI
    caseItems.forEach((item) => {
      const isCurrent = item.getAttribute('data-case') === String(caseId);
      item.classList.toggle('active', isCurrent);
      item.setAttribute('aria-selected', isCurrent);
    });

    // Update preview card
    if (previewBadge) previewBadge.textContent = data.badge;
    if (previewId) previewId.textContent = 'ID: ' + data.id;
    if (previewTitle) previewTitle.textContent = data.title;
    if (previewDesc) previewDesc.textContent = data.desc;
    if (previewVisual) previewVisual.innerHTML = data.visualHtml;

    if (previewMetrics) {
      previewMetrics.innerHTML = data.metrics
        .map(
          (m) => `
        <div class="p-metric">
          <span class="p-val">${m.val}</span>
          <span class="p-lbl">${m.lbl}</span>
        </div>
      `
        )
        .join('');
    }

    if (previewTech) {
      previewTech.innerHTML = data.tech
        .map((t) => `<span class="tech-chip">${t}</span>`)
        .join('');
    }
  }

  // Event listeners for items
  caseItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const caseId = parseInt(item.getAttribute('data-case'), 10);
      updatePreview(caseId);
    });

    item.addEventListener('click', () => {
      const caseId = parseInt(item.getAttribute('data-case'), 10);
      updatePreview(caseId);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const caseId = parseInt(item.getAttribute('data-case'), 10);
        updatePreview(caseId);
      }
    });
  });

  // Open Modal Details
  if (btnOpenDetail && modal) {
    btnOpenDetail.addEventListener('click', () => {
      const data = CASE_DATA[currentCaseId];
      if (!data) return;

      modalBadge.textContent = data.badge;
      modalTitle.textContent = data.title;
      modalSubtitle.textContent = data.role;
      modalContent.innerHTML = data.deepDetail;
      modal.showModal();
    });
  }

  if (btnCloseCaseModal && modal) {
    btnCloseCaseModal.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });
  }

  // Initial load
  updatePreview(1);
}

/* ==========================================================================
   3. INTERACTIVE CAREER JOURNEY (SVG NODES)
   ========================================================================== */
const JOURNEY_STOPS = {
  1: {
    period: '2018 – 2022',
    badge: 'NỀN TẢNG HỌC THUẬT',
    role: 'Cử Nhân Kinh Tế (Bachelor of Economics)',
    company: 'Đại Học Kinh Tế TP. Hồ Chí Minh (UEH)',
    bullets: [
      'Được đào tạo bài bản về tư duy kinh tế vĩ mô & vi mô, phân tích định lượng và mô hình hóa dữ liệu.',
      'Rèn luyện phương pháp luận giải quyết vấn đề dựa trên bằng chứng dữ liệu (Data-driven Problem Solving).',
      'Xây dựng kỹ năng giao tiếp chiến lược, quản trị dự án và tư duy kinh doanh hiện đại.'
    ],
    impact: 'Nền tảng tư duy cấu trúc hóa và phân tích số liệu giúp chuyển dịch dễ dàng sang lĩnh vực Logistics.'
  },
  2: {
    period: '2023 – 07/2025',
    badge: 'THẤU HIỂU NỖI ĐAU KHÁCH HÀNG',
    role: 'Key Account Care Executive',
    company: 'Giao Hàng Nhanh (GHN Express) · Đối tác TMĐT: Shopee, Lazada, Tiki',
    bullets: [
      'Trực tiếp tiếp nhận và xử lý hàng nghìn khiếu nại phức tạp trên các hệ thống chuyên dụng (IH Shopee, X-Space Lazada, Jira Tiki, Freshdesk).',
      'Đại diện nội bộ kết nối trực tiếp với đội ngũ Vận hành trung chuyển và bưu cục địa phương để cứu đơn hàng trong tích tắc.',
      'Đúc rút và phân loại nguyên nhân cốt lõi dẫn tới khiếu nại trễ hẹn, hỏng vỡ hoặc mất hàng trong chuỗi cung ứng.',
      'Chủ động đề xuất cải tiến các quy trình tương tác nội bộ rườm rà gây chậm trễ thời gian phản hồi khách hàng.'
    ],
    impact: 'Trực chiến xử lý sự cố thực tế giúp hiểu rõ tận tường từng mắt xích vận hành giao nhận.'
  },
  3: {
    period: '07/2025 – 05/2026',
    badge: 'TỐI ƯU HÓA QUY TRÌNH',
    role: 'Key Account Executive (Chiến Binh Xuất Sắc 2025)',
    company: 'Giao Hàng Nhanh (GHN Express) · Quản lý Khách Hàng Doanh Nghiệp Lớn',
    bullets: [
      'Đóng vai trò cố vấn tin cậy (trusted advisor) cho các khách hàng TMĐT lớn; dự báo sản lượng và khuyến nghị hành động tuân thủ SLA.',
      'Thiết kế lại luồng trạng thái vận đơn (shipping status flow), cắt giảm 15-20% tỷ lệ liên hệ khiếu nại trên mỗi đơn hàng.',
      'Tự tay phát triển các công cụ báo cáo tự động bằng Google Apps Script, giảm 30% thời gian thao tác thủ công của team.',
      'Xử lý các tình huống leo thang (escalation) nghiêm trọng với sàn TMĐT, đảm bảo tính liên tục của hợp đồng dịch vụ.',
      'Vinh dự được trao tặng giải thưởng "Chiến binh xuất sắc năm 2025" từ Ban Điều hành GHN.'
    ],
    impact: 'Bước chuyển mình từ "người hỗ trợ" thành "người kiến tạo giải pháp dữ liệu" cho khách hàng lớn.'
  },
  4: {
    period: '2026 – Hiện tại',
    badge: 'ĐIỀU HÀNH & TỰ ĐỘNG HÓA CHIẾN LƯỢC',
    role: 'Assistant Regional Director (Trợ Lý Giám Đốc Vùng Nam Trung Bộ)',
    company: 'Giao Hàng Nhanh (GHN) · 5 Tỉnh: Khánh Hòa, Lâm Đồng, Đắk Nông, Ninh Thuận, Bình Thuận',
    bullets: [
      'Lập báo cáo vận hành, kinh doanh và theo dõi PFM cho Giám đốc Vùng; tổng hợp dữ liệu KPI 5 tỉnh và 27 Quản lý khu vực (AMs) với 85 bưu cục.',
      'Xây dựng pipeline báo cáo tự động (Python, Google Apps Script), rút ngắn 85% thời gian thủ công và theo dõi KPI thời gian thực (%OPR, %ODR, %FD).',
      'Phát triển hệ sinh thái Bot Telegram: Bot Điểm danh báo cáo 5 mốc, Bot Điểm danh Kaizen 5S kho bãi, Bot Check-in thực địa cho HRBP & SUP.',
      'Dẫn dắt đánh giá nhân sự tài năng hàng quý trên 5 tỉnh, xác định nhân sự tiềm năng cao và định hướng lộ trình thăng tiến.'
    ],
    impact: 'Tự động hóa 100% luồng báo cáo buổi sáng & trưa cho Ban Giám đốc Vùng Nam Trung Bộ.'
  }
};

function initCareerJourney() {
  const nodes = document.querySelectorAll('.journey-node');
  const jPeriod = document.getElementById('jPeriod');
  const jBadge = document.getElementById('jBadge');
  const jRole = document.getElementById('jRole');
  const jCompany = document.getElementById('jCompany');
  const jBullets = document.getElementById('jBullets');
  const jFooter = document.getElementById('jFooter');

  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      const stopId = parseInt(node.getAttribute('data-stop'), 10);
      const data = JOURNEY_STOPS[stopId];
      if (!data) return;

      nodes.forEach((n) => n.classList.remove('active'));
      node.classList.add('active');

      if (jPeriod) jPeriod.textContent = data.period;
      if (jBadge) jBadge.textContent = data.badge;
      if (jRole) jRole.textContent = data.role;
      if (jCompany) jCompany.textContent = data.company;

      if (jBullets) {
        jBullets.innerHTML = data.bullets
          .map((b) => `<li>${b}</li>`)
          .join('');
      }

      if (jFooter) {
        jFooter.innerHTML = `<span class="j-impact-tag"><strong>Tác động chính:</strong> ${data.impact}</span>`;
      }
    });
  });
}

/* ==========================================================================
   4. CONTROL TOWER LIVE SIMULATOR
   ========================================================================== */
const SCENARIOS = {
  bot_5_moc: {
    terminalLines: [
      { text: '[07:30 - MỐC 1] Điểm danh quân số: 642 bưu tá xuất tuyến tại 85 bưu cục.', type: 'dim' },
      { text: '[10:00 - MỐC 2] Quét tỷ lệ xuất kho: 96.8% đơn hàng đã lên thùng xe đi phát ca 1.', type: 'dim' },
      { text: '[11:50 - MỐC 3] CHỐT CA TRƯA: Quét danh sách 85 bưu cục toàn vùng NTB...', type: 'warn' },
      { text: '[BOT PING] Phát hiện 2 bưu cục chưa chốt báo cáo: BC Di Linh & BC Hàm Tân!', type: 'err' },
      { text: '[ALERT SENT] Tự động bắn tin nhắc nhở đích danh AM phụ trách trên nhóm điều hành.', type: 'success' }
    ],
    tg: {
      time: '11:55',
      channel: 'NTB_DIEU_HANH_5_TINH',
      text: `⏰ <b>ĐIỂM DANH BÁO CÁO MỐC 3 (12H00) — CHỐT CA TRƯA</b>
📊 <b>Tiến độ toàn vùng:</b> %GTC đạt <b>84.6%</b> · Đã giao: 18.420 đơn
🚨 <b>Bưu cục CHƯA nộp báo cáo mốc:</b>
  1. <b>Bưu cục Di Linh (Lâm Đồng):</b> AM Trần Văn Phước
  2. <b>Bưu cục Hàm Tân (Bình Thuận):</b> AM Phan Đình Duy

👉 <b>YÊU CẦU:</b> AM vui lòng liên hệ bưu cục chốt dữ liệu trước 12h10 để hoàn thiện Dashboard toàn vùng!`
    }
  },
  bot_kaizen: {
    terminalLines: [
      { text: '[08:00 - KAIZEN] Kích hoạt cổng tiếp nhận ảnh check-in vệ sinh kho bãi 85 bưu cục.', type: 'dim' },
      { text: '[AUDIT] Đã nhận 83/85 ảnh. Kiểm tra tiêu chí 5S: Sàn kho, bàn chia chọn, lối thoát hiểm.', type: 'warn' },
      { text: '[CHECK FAIL] Phát hiện vi phạm layout: Bưu cục Đức Trọng (hàng cồng kềnh chắn cửa xuất tải).', type: 'err' },
      { text: '[DISPATCH] Đã tạo biên bản Kaizen & gửi cảnh báo trực tiếp kèm hình ảnh vi phạm.', type: 'success' }
    ],
    tg: {
      time: '08:15',
      channel: 'KAIZEN_5S_NTB_OPERATIONS',
      text: `🧹 <b>CẢNH BÁO KỶ LUẬT KAIZEN & LAYOUT BƯU CỤC</b>
📍 <b>Bưu cục:</b> Đức Trọng (Lâm Đồng) · <b>AM phụ trách:</b> Nguyễn Văn C
📸 <b>Vi phạm phát hiện qua ảnh check-in:</b>
  • Kiện hàng >10kg để tràn ra lối thoát hiểm
  • Khu vực hàng hoàn chưa phân loại tem nhãn
👉 <b>CHỈ ĐẠO:</b> Đề nghị Trưởng bưu cục tổ chức sắp xếp lại theo layout chuẩn 5S và chụp ảnh phản hồi trước 14h00!`
    }
  },
  bot_hrbp_sup: {
    terminalLines: [
      { text: '[GEO CHECK-IN] Nhận tín hiệu check-in thực địa từ đội ngũ HRBP & Giám sát vận hành (SUP).', type: 'dim' },
      { text: '[GPS VERIFY] SUP Lê Hoàng Nam check-in tại Bưu cục Phan Rang (Ninh Thuận) — GPS hợp lệ (0m lệch).', type: 'success' },
      { text: '[FORM SUBMIT] Đã ghi nhận biên bản kiểm tra: Đánh giá quân số bưu tá, camera, an toàn kho.', type: 'warn' },
      { text: '[SYNC] Tự động đồng bộ báo cáo thực địa lên Dashboard Giám Đốc Vùng.', type: 'success' }
    ],
    tg: {
      time: '09:20',
      channel: 'HRBP_SUP_FIELD_CHECKIN',
      text: `📍 <b>CHECK-IN THỰC ĐỊA HRBP & SUPERVISOR</b>
👤 <b>Nhân sự:</b> SUP Lê Hoàng Nam (Giám sát Vận hành)
🏢 <b>Bưu cục ghé thăm:</b> Bưu cục Phan Rang (Ninh Thuận)
🛰️ <b>Tọa độ GPS:</b> Hợp lệ tại vị trí bưu cục (09h18)
📝 <b>Nội dung đánh giá thực địa:</b>
  • Quân số: 18/18 bưu tá đi làm đúng giờ, đồng phục chuẩn
  • Tình trạng kho: Đạt tiêu chuẩn Kaizen 5S, camera hoạt động 100%
✓ <i>Biên bản kiểm tra đã được số hóa & lưu vào hệ thống NTB.</i>`
    }
  }
};

function initSimulator() {
  const scenarioBtns = document.querySelectorAll('.btn-scenario');
  const btnRunSim = document.getElementById('btnRunSim');
  const terminalBody = document.getElementById('simTerminalBody');
  const simStatus = document.getElementById('simStatus');
  const telegramMockup = document.getElementById('telegramMockup');
  const tgTime = document.getElementById('tgTime');
  const tgMessage = document.getElementById('tgMessage');

  let activeScenario = 'bot_5_moc';

  scenarioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeScenario = btn.getAttribute('data-scenario');
      if (telegramMockup) telegramMockup.style.display = 'none';
      if (simStatus) {
        simStatus.textContent = 'READY';
        simStatus.style.color = 'var(--accent-lime)';
      }
      if (terminalBody) {
        terminalBody.innerHTML = `
          <div class="t-line dim">[READY] Đã chọn tình huống: <strong>${btn.textContent.trim()}</strong>.</div>
          <div class="t-line highlight-lime">Nhấp "Kích hoạt Bot xử lý tự động" để chạy quy trình bóc tách.</div>
        `;
      }
    });
  });

  if (btnRunSim) {
    btnRunSim.addEventListener('click', () => {
      const data = SCENARIOS[activeScenario];
      if (!data) return;

      btnRunSim.disabled = true;
      if (simStatus) {
        simStatus.textContent = 'PROCESSING...';
        simStatus.style.color = 'var(--accent-amber)';
      }
      if (telegramMockup) telegramMockup.style.display = 'none';
      if (terminalBody) terminalBody.innerHTML = '';

      let lineIndex = 0;
      const interval = setInterval(() => {
        if (lineIndex < data.terminalLines.length) {
          const l = data.terminalLines[lineIndex];
          const div = document.createElement('div');
          div.className = `t-line ${l.type}`;
          div.textContent = l.text;
          terminalBody.appendChild(div);
          lineIndex++;
        } else {
          clearInterval(interval);
          btnRunSim.disabled = false;
          if (simStatus) {
            simStatus.textContent = 'ALERT SENT ✓';
            simStatus.style.color = 'var(--accent-emerald)';
          }

          // Show Telegram alert mockup
          if (telegramMockup && tgMessage) {
            telegramMockup.style.display = 'block';
            if (tgTime) tgTime.textContent = data.tg.time;
            tgMessage.innerHTML = data.tg.text;
          }
        }
      }, 450);
    });
  }
}

/* ==========================================================================
   5. CONTACT & MODAL CONTROLLERS
   ========================================================================== */
function initContactAndModals() {
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const copyFeedback = document.getElementById('copyFeedback');
  const emailToCopy = 'thuytqt120820@gmail.com';

  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        if (copyFeedback) copyFeedback.textContent = '✔ Đã chép!';
        btnCopyEmail.style.borderColor = 'var(--accent-emerald)';
        btnCopyEmail.style.color = 'var(--accent-emerald)';

        setTimeout(() => {
          if (copyFeedback) copyFeedback.textContent = 'Sao chép';
          btnCopyEmail.style.borderColor = '';
          btnCopyEmail.style.color = '';
        }, 2500);
      });
    });
  }

  // CV Viewer Modal
  const modalCv = document.getElementById('modalCvViewer');
  const btnOpenCvModal = document.getElementById('btnOpenCvModal');
  const btnViewCv = document.getElementById('btnViewCv');
  const btnCloseCvModal = document.getElementById('btnCloseCvModal');

  function openCv() {
    if (modalCv) modalCv.showModal();
  }

  if (btnOpenCvModal) btnOpenCvModal.addEventListener('click', openCv);
  if (btnViewCv) btnViewCv.addEventListener('click', openCv);
  if (btnCloseCvModal && modalCv) {
    btnCloseCvModal.addEventListener('click', () => modalCv.close());
    modalCv.addEventListener('click', (e) => {
      if (e.target === modalCv) modalCv.close();
    });
  }
}

/* ==========================================================================
   6. LIVE TICKER ANIMATION
   ========================================================================== */
function initLiveTicker() {
  const tickerText = document.getElementById('liveTickerText');
  if (!tickerText) return;

  const messages = [
    '🌟 Live Production App: namtrungbo.vercel.app • Hệ thống Quản trị Vận hành NTB do Thủy xây dựng',
    '5 Tỉnh Nam Trung Bộ • 27 Account Managers (AMs) • 85 Bưu cục • Tích hợp Trợ lý AI qua Giao thức MCP',
    'Khánh Hòa: %GTC ca sáng đạt 96.4% • Bưu cục Nha Trang giải tỏa 100% đơn tồn',
    'Lâm Đồng: Phát hiện & xử lý 2 đơn COD gối đầu • Kiểm soát an toàn ngân quỹ',
    'Đắk Nông: Thang cứu hộ động kích hoạt thành công • 14 bưu cục vượt chỉ tiêu Bậc 2',
    'Ninh Thuận & Bình Thuận: Kết nối sàn TMĐT thông suốt • SLA đạt 99.1%'
  ];

  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % messages.length;
    tickerText.style.opacity = '0';
    setTimeout(() => {
      tickerText.textContent = messages[idx];
      tickerText.style.opacity = '1';
    }, 400);
  }, 4800);
}

/* ==========================================================================
   7. WEB AUDIO INTERACTIVE SOUND FX & LO-FI AMBIENT RADIO
   ========================================================================== */
function showToast(msg) {
  const toast = document.getElementById('audioToast');
  if (!toast) return;
  toast.innerHTML = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

const AudioEngine = {
  ctx: null,
  isRadioOn: false,
  radioOscs: [],
  gainMaster: null,
  gainRadio: null,
  lastHoverTime: 0,

  init() {
    try {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.gainMaster = this.ctx.createGain();
        this.gainMaster.gain.setValueAtTime(0.75, this.ctx.currentTime);
        this.gainMaster.connect(this.ctx.destination);

        this.gainRadio = this.ctx.createGain();
        this.gainRadio.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.gainRadio.connect(this.gainMaster);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  },

  playHover() {
    if (!this.isRadioOn) return;
    const now = Date.now();
    if (now - this.lastHoverTime < 70) return;
    this.lastHoverTime = now;
    this.init();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.gainMaster);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  },

  playClick() {
    if (!this.isRadioOn) return;
    this.init();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.gainMaster);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  },

  playSuccess() {
    this.init();
    try {
      // Melodic 4-note chord: Eb4, G4, Bb4, Eb5
      const notes = [311.13, 392.00, 466.16, 622.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startT = this.ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0, startT);
        gain.gain.linearRampToValueAtTime(0.2, startT + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.5);

        osc.connect(gain);
        gain.connect(this.gainMaster);
        osc.start(startT);
        osc.stop(startT + 0.5);
      });
    } catch (e) {}
  },

  playTerminal() {
    if (!this.isRadioOn) return;
    this.init();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(900 + Math.random() * 500, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.gainMaster);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  },

  playTelegram() {
    this.init();
    try {
      [720, 1080].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startT = this.ctx.currentTime + i * 0.13;
        osc.frequency.setValueAtTime(freq, startT);

        gain.gain.setValueAtTime(0.22, startT);
        gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.4);

        osc.connect(gain);
        gain.connect(this.gainMaster);
        osc.start(startT);
        osc.stop(startT + 0.4);
      });
    } catch (e) {}
  },

  playHorn() {
    this.init();
    try {
      // Dual-tone realistic GHN truck horn (sawtooth brassy blast)
      const tones = [293.66, 369.99]; // D4 and F#4
      tones.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.24, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.24, this.ctx.currentTime + 0.28);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.gainMaster);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.45);
      });
    } catch (e) {}
  },

  playScooterBeep() {
    this.init();
    try {
      // Cute high-pitch scooter beep ("Tin tin!")
      [0, 0.1].forEach((delay) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startT = this.ctx.currentTime + delay;
        osc.frequency.setValueAtTime(988, startT);

        gain.gain.setValueAtTime(0.2, startT);
        gain.gain.exponentialRampToValueAtTime(0.0001, startT + 0.07);

        osc.connect(gain);
        gain.connect(this.gainMaster);
        osc.start(startT);
        osc.stop(startT + 0.07);
      });
    } catch (e) {}
  },

  playNitro() {
    this.init();
    try {
      // Powerful rocket whoosh + sub-bass roar
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.75);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);
      filter.frequency.setValueAtTime(260, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 0.35);
      filter.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.75);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.32, this.ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.75);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainMaster);
      noise.start();
      noise.stop(this.ctx.currentTime + 0.75);

      // Low bass rumble
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(70, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.75);
      oscGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.75);
      osc.connect(oscGain);
      oscGain.connect(this.gainMaster);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.75);
    } catch (e) {}
  },

  async toggleRadio() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      try { await this.ctx.resume(); } catch(e){}
    }

    this.isRadioOn = !this.isRadioOn;
    const btn = document.getElementById('btnSoundToggle');
    const label = document.getElementById('soundLabel');
    const lofiAudio = document.getElementById('lofiAudio');

    if (this.isRadioOn) {
      if (btn) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      }
      if (label) label.textContent = 'Radio: BẬT ♫';

      // Play audio stream or fallback to synth
      if (lofiAudio) {
        lofiAudio.volume = 0.35;
        lofiAudio.play().catch(() => {
          this.startAmbientRadio();
        });
      } else {
        this.startAmbientRadio();
      }

      this.playSuccess();
      showToast('📻 <strong>Đã BẬT Radio Lo-Fi:</strong> Nhấp vào các mục trên trang để nghe âm thanh!');
    } else {
      if (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
      if (label) label.textContent = 'Radio: TẮT';
      if (lofiAudio) {
        lofiAudio.pause();
      }
      this.stopAmbientRadio();
      showToast('🔇 Đã tắt âm thanh Radio');
    }
  },

  startAmbientRadio() {
    this.stopAmbientRadio();
    try {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, this.ctx.currentTime);
      filter.connect(this.gainRadio);

      // Warm relaxing chord: Eb major 9
      const chordFreqs = [155.56, 233.08, 293.66, 392.00];
      this.radioOscs = chordFreqs.map(f => {
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        osc.connect(filter);
        osc.start();
        return osc;
      });

      // LFO filter sweep
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.25, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      this.radioOscs.push(lfo);
    } catch (e) {}
  },

  stopAmbientRadio() {
    this.radioOscs.forEach(o => {
      try { o.stop(); o.disconnect(); } catch (e) {}
    });
    this.radioOscs = [];
  }
};

function initAudioEngine() {
  const btnToggle = document.getElementById('btnSoundToggle');
  if (btnToggle) {
    btnToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      AudioEngine.toggleRadio();
    });
  }

  // Hook global hover & click sounds
  const interactiveEls = document.querySelectorAll(
    '.nav-link, .btn-primary, .btn-secondary, .case-item, .btn-scenario, .journey-node, .btn-open-detail, .btn-copy-email, .btn-sort-now'
  );

  interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => AudioEngine.playHover());
    el.addEventListener('click', () => AudioEngine.playClick());
  });

  // Simulator hookups
  const btnRunSim = document.getElementById('btnRunSim');
  if (btnRunSim) {
    btnRunSim.addEventListener('click', () => {
      const origInterval = setInterval(() => {
        if (btnRunSim.disabled) {
          AudioEngine.playTerminal();
        } else {
          clearInterval(origInterval);
          AudioEngine.playTelegram();
        }
      }, 450);
    });
  }

  // Sort now hookup
  const btnSortNow = document.getElementById('btnSortNow');
  if (btnSortNow) {
    btnSortNow.addEventListener('click', () => {
      setTimeout(() => AudioEngine.playSuccess(), 150);
    });
  }
}

/* ==========================================================================
   8. GHN HIGHWAY TRANSIT & VEHICLE SIMULATION
   ========================================================================== */
function initGhnHighway() {
  const ghnTruck = document.getElementById('ghnTruck');
  const ghnScooter = document.getElementById('ghnScooter');
  const btnHonkTruck = document.getElementById('btnHonkTruck');
  const btnTurboTruck = document.getElementById('btnTurboTruck');
  const parcelDropZone = document.getElementById('parcelDropZone');
  const highwayTrack = document.getElementById('highwayTrack');
  const truckBubble = document.getElementById('truckBubble');

  if (!ghnTruck || !highwayTrack) return;

  const parcelPhrases = [
    '📦 Đơn Shopee hỏa tốc đã bàn giao!',
    '⚡ SLA cam kết 24h: 98.7%!',
    '🏔️ Vượt đèo Ngoạn Mục an toàn!',
    '🚀 Hub Nha Trang -> Hub Phan Thiết: On-time!',
    '📊 GTC +100% · AM chuẩn hóa thành công!',
    '💰 COD 100% minh bạch về ví!',
    '🚚 Bưu cục Đà Lạt giải tỏa 100% tồn!',
    '🔥 Tuyến liên tỉnh Nam Trung Bộ thông suốt!',
    '📦 Đơn TikTok Shop giao siêu tốc!'
  ];

  let phraseIdx = 0;

  function dropParcelBadge(sourceEl, customText) {
    if (!parcelDropZone || !highwayTrack) return;
    const text = customText || parcelPhrases[phraseIdx % parcelPhrases.length];
    phraseIdx++;

    const badge = document.createElement('div');
    badge.className = 'floating-parcel-badge';
    badge.innerHTML = text;

    // Calculate position
    const trackRect = highwayTrack.getBoundingClientRect();
    const sourceRect = sourceEl.getBoundingClientRect();
    const leftOffset = Math.max(20, Math.min(trackRect.width - 240, sourceRect.left - trackRect.left + sourceRect.width * 0.2));
    const topOffset = Math.max(10, sourceRect.top - trackRect.top - 18);

    badge.style.left = `${leftOffset}px`;
    badge.style.top = `${topOffset}px`;

    parcelDropZone.appendChild(badge);
    setTimeout(() => {
      badge.remove();
    }, 2200);
  }

  function triggerTruckHonk() {
    AudioEngine.playHorn();
    dropParcelBadge(ghnTruck);
    if (truckBubble) {
      truckBubble.textContent = 'BÍP BÍP! 📢 Bác tài nhường đường nào!';
      truckBubble.style.opacity = '1';
      truckBubble.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        truckBubble.textContent = 'Bấm vào em đi! 🚚💨';
        truckBubble.style.transform = 'translateY(0)';
      }, 2500);
    }
    showToast('🚚 <strong>GHN Express:</strong> BÍP BÍP! Xe tải 10 tấn đang luân chuyển hàng liên tỉnh!');
  }

  let isTurboActive = false;
  function toggleTurbo() {
    isTurboActive = !isTurboActive;
    if (isTurboActive) {
      ghnTruck.classList.add('turbo-active');
      if (btnTurboTruck) {
        btnTurboTruck.classList.add('active');
        btnTurboTruck.innerHTML = '<span>🔥 Turbo Nitro Đang Chạy! (3.5x)</span>';
      }
      AudioEngine.playNitro();
      if (truckBubble) {
        truckBubble.textContent = 'PHÓNG NHANH GIAO ĐÚNG HẸN! 🚀💨';
        truckBubble.style.opacity = '1';
      }
      // Drop several rapid parcels
      for (let i = 0; i < 3; i++) {
        setTimeout(() => dropParcelBadge(ghnTruck, '🔥 GIAO SIÊU TỐC NITRO!'), i * 350);
      }
      showToast('🚀 <strong>NITRO ACTIVATED:</strong> Xe GHN tăng tốc 3.5x vượt đèo Ngoạn Mục!');
    } else {
      ghnTruck.classList.remove('turbo-active');
      if (btnTurboTruck) {
        btnTurboTruck.classList.remove('active');
        btnTurboTruck.innerHTML = '<span>⚡ Kích hoạt Turbo Nitro</span>';
      }
      if (truckBubble) {
        truckBubble.textContent = 'Chạy vận tốc chuẩn định mức 🚚';
      }
      showToast('⚡ Xe GHN trở lại tốc độ hành trình tiêu chuẩn');
    }
  }

  function triggerScooter() {
    AudioEngine.playScooterBeep();
    dropParcelBadge(ghnScooter, '🛵 Bưu tá chặng cuối: "Khách ơi xuống nhận hàng nha!"');
    showToast('🛵 <strong>Bưu tá GHN:</strong> Tin tin! Đang giao hàng chặng cuối tận tay khách hàng!');
  }

  // Hook buttons
  if (btnHonkTruck) {
    btnHonkTruck.addEventListener('click', (e) => {
      e.preventDefault();
      triggerTruckHonk();
    });
  }

  if (btnTurboTruck) {
    btnTurboTruck.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTurbo();
    });
  }

  // Hook vehicles
  ghnTruck.addEventListener('click', (e) => {
    e.preventDefault();
    triggerTruckHonk();
  });

  ghnTruck.addEventListener('dblclick', (e) => {
    e.preventDefault();
    toggleTurbo();
  });

  ghnTruck.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerTruckHonk();
    }
  });

  if (ghnScooter) {
    ghnScooter.addEventListener('click', (e) => {
      e.preventDefault();
      triggerScooter();
    });
    ghnScooter.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerScooter();
      }
    });
  }
}

