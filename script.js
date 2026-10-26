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
  initBotEcosystemMatrix();
  initCareerJourney();
  initSimulator();
  initContactAndModals();
  initLiveTicker();
  initAudioEngine();
  initGhnHighway();
  initLiveInPlacePlayer();
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
    const isDesktop = width > 1024;
    const colCount = 7;
    const maxAreaWidth = isDesktop ? width * 0.46 : width * 0.85;
    const colWidth = Math.min(64, maxAreaWidth / colCount);
    const startX = isDesktop ? width * 0.04 : width * 0.08;
    const baseY = height * 0.68;

    nodes.forEach((n) => {
      // Form structured bar columns in the left/center zone
      n.targetX = startX + n.colIndex * (colWidth + 8);
      n.targetY = baseY - n.rowRank * 14;
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
    id: 'NTB-COD-01',
    badge: 'CASE 01 · FINANCIAL RISK · FRAUD DETECTION',
    title: 'Cảnh Báo Gối Đầu Tiền Mặt COD & Giả Mạo Vị Trí (Fake GPS)',
    role: 'Kiểm Soát Rủi Ro Tài Chính & Dòng Tiền · Python, GPS Haversine, Google Sheets API, GTalk Bot',
    desc: 'Thuật toán bóc tách giao thoa 3 điều kiện: Đơn có tiền thu hộ COD > 400.000 VNĐ bị hoãn hẹn liên tiếp từ 2 ngày, kết hợp độ lệch tọa độ check-in GPS bưu tá > 2.000m so với địa chỉ khách hàng. Hệ thống tự động phân tách tab riêng cho 19 AMs + 2 SUPs và bắn cảnh báo đích danh yêu cầu kiểm tra túi hàng bưu tá trước 11h00 trưa.',
    metrics: [
      { val: '> 100% Đơn >400k', lbl: 'Bóc tách toàn diện đơn rủi ro' },
      { val: '95% Triệt tiêu', lbl: 'Gian lận COD & Fake GPS' },
      { val: '< 11:00 Trưa', lbl: 'AM can thiệp ngay đầu ca sáng' }
    ],
    tech: ['Python 3.11', 'GPS Haversine Formula', 'Google Sheets API (gspread)', 'Google Chat Webhooks', 'Pandas Pipeline', 'Scheduled Tasks'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-rose); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#f43f5e; border-radius:50%; box-shadow:0 0 8px #f43f5e;"></span>
          RADAR PHÁT HIỆN GIAN LẬN DÒNG TIỀN COD & GPS
        </span>
      </div>
      <div style="background:rgba(244,63,94,0.06); border:1px solid rgba(244,63,94,0.25); border-radius:8px; padding:12px; margin-bottom:10px;">
        <div style="font-size:0.72rem; color:var(--accent-rose); font-weight:700; margin-bottom:6px; text-transform:uppercase;">
          ⚠️ 3 ĐIỀU KIỆN KÍCH HOẠT CẢNH BÁO ĐỎ:
        </div>
        <div style="display:grid; grid-template-columns:1fr; gap:6px; font-size:0.75rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:5px 8px; border-radius:4px;">
            <span>1. Tiền thu hộ COD lớn:</span>
            <span style="color:var(--accent-rose); font-family:var(--font-mono); font-weight:700;">COD &gt; 400.000 VNĐ</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:5px 8px; border-radius:4px;">
            <span>2. Tần suất hoãn hẹn giao:</span>
            <span style="color:var(--accent-amber); font-family:var(--font-mono); font-weight:700;">Liên tiếp ≥ 2 Ngày</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:5px 8px; border-radius:4px;">
            <span>3. Tọa độ check-in lệch thực tế:</span>
            <span style="color:var(--accent-rose); font-family:var(--font-mono); font-weight:700;">Độ lệch GPS &gt; 2.000m (Fake POD)</span>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-dim);">
        <span style="color:var(--accent-emerald);">✓ Phân luồng Tab Sheet riêng cho 19 AMs + 2 SUPs</span>
        <span style="color:var(--accent-lime); font-family:var(--font-mono);">Ping GTalk: 08:30 sáng</span>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Tại địa bàn 5 tỉnh Nam Trung Bộ với 86 bưu cục, 1 kho chuyển tiếp, 4 kho trung chuyển và hàng trăm bưu tá, công nợ tiền mặt COD luôn là rủi ro tài chính sống còn. Nhiều bưu tá thu tiền mặt COD từ người nhận nhưng không nộp về tài khoản bưu cục đúng hạn, tự ý cập nhật trạng thái "Khách hoãn / Hẹn giao lại" để chiếm dụng tiền mặt tiêu xài cá nhân hoặc lấy tiền thu của đơn sau đắp bù đơn trước (gối đầu).
        </p>
        <p class="m-text" style="margin-top:8px;">
          Nghiêm trọng hơn, nhiều bưu tá đứng ở nhà hoặc quán cà phê cách xa địa chỉ khách hàng hàng kilomet để bấm cập nhật "Không liên lạc được" (Fake GPS / Giả mạo POD) nhằm trốn tránh chỉ tiêu phát ca. Việc kiểm tra thủ công là bất khả thi vì mỗi ngày phát sinh hàng chục nghìn đơn giao.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán & Insight bóc tách dữ liệu</h4>
        <p class="m-text">Thủy xây dựng thuật toán quét dữ liệu tự động kết hợp 3 điều kiện giao nhau:</p>
        <ul class="m-list">
          <li><strong>Ngưỡng tiền mặt:</strong> Lọc các đơn có tiền COD &gt; 400.000 VNĐ bị hoãn hẹn liên tiếp từ 2 ngày trở lên.</li>
          <li><strong>Thuật toán Haversine đo độ lệch GPS:</strong> Tính khoảng cách giữa tọa độ check-in của app shipper và geocode địa chỉ khách hàng. Nếu độ lệch vượt quá 2.000m, hệ thống gắn cờ nghi vấn Fake POD.</li>
          <li><strong>Xếp hạng rủi ro (Risk Ranking):</strong> Tự động gom nhóm theo Bưu cục và xếp hạng Top nhân viên giao hàng có chỉ số rủi ro chiếm dụng cao nhất vùng.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🎯 Quyết định & Hành động can thiệp (Actionable Decision)</h4>
        <p class="m-text">
          Hệ thống tự động phân tách danh sách mã vận đơn vi phạm theo từng tab Google Sheet riêng của 19 AMs và 2 SUPs. Đúng 08:30 sáng, Bot Cảnh Báo Gối Đầu COD tự động gửi tin nhắn đích danh kèm link sheet vào nhóm điều hành của AM, yêu cầu AM <strong>xuống kiểm tra thực tế thùng xe và túi hàng của bưu tá trước 11h00 trưa</strong>.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Triệt tiêu 95%</strong> hành vi chiếm dụng dòng tiền COD và Fake GPS bưu tá toàn vùng NTB.</li>
          <li><strong>Thu hồi 100%</strong> công nợ về tài khoản ngay trong ngày phát sinh nghi vấn, bảo vệ an toàn ngân quỹ cho doanh nghiệp.</li>
          <li>Thiết lập chuẩn mực giám sát minh bạch, giúp AM kiểm soát địa bàn mà không cần tranh cãi.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          Python ETL Data Engine • Google Chat Webhook API & GSpread • Báo cáo Excel chi tiết • Windows Automation Task Scheduler.
        </p>
      </div>
    `
  },

  2: {
    id: 'NTB-GTC-02',
    badge: 'CASE 02 · OPERATIONS PRODUCTIVITY · TARGET GTC',
    title: 'Báo Cáo Năng Suất Giao Hàng Real-time & Đo Lường Gap To Target',
    role: 'Theo Dõi Năng Suất NVPTT & Quản Trị Target GTC Bưu Cục · Python, Jinja2 Thẻ Ảnh PNG, GTalk',
    desc: 'Hệ thống tự động theo dõi sản lượng và năng suất giao hàng của nhân viên theo thời gian thực (Realtime & N-1) kết hợp quản trị chỉ tiêu GTC bưu cục. Tự động quy đổi tỷ lệ % mục tiêu thành "Số Lượng Đơn Hàng Còn Thiếu (Gap to Target)" gửi kèm thẻ ảnh trực quan qua GTalk theo các khung giờ 11h30, 15h00, 18h00 giúp AM điều phối tiếp ứng dứt điểm chỉ tiêu.',
    metrics: [
      { val: 'Real-time', lbl: 'Theo dõi năng suất shipper theo giờ' },
      { val: 'Gap-to-Target', lbl: 'Tính số đơn còn thiếu đạt chỉ tiêu' },
      { val: '11:30 · 15:00 · 18:00', lbl: 'Gửi thẻ ảnh tự động qua GTalk' }
    ],
    tech: ['Python 3.11', 'Playwright Headless', 'Jinja2 HTML Cards', 'Pillow Image Generation', 'Google Chat API', 'Năng Suất Realtime & N-1'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-emerald); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#10b981; border-radius:50%; box-shadow:0 0 8px #10b981;"></span>
          BÁO CÁO NĂNG SUẤT NVPTT & THEO DÕI TARGET GTC
        </span>
      </div>
      <div style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.25); border-radius:8px; padding:12px; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--text-main);">Bưu cục: (BTH) Đồng Kho - AM: Lê Thanh Nhựt</span>
          <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--accent-amber); background:rgba(245,158,11,0.15); padding:2px 6px; border-radius:4px;">GTC Hiện Tại: 47.51%</span>
        </div>
        <div style="background:rgba(0,0,0,0.3); border-radius:6px; padding:8px; font-size:0.73rem; line-height:1.5;">
          <div style="color:var(--accent-cyan); font-weight:600; margin-bottom:3px;">⚡ ĐÁNH GIÁ TIẾN ĐỘ THỜI GIAN THỰC (REAL-TIME):</div>
          <div style="color:var(--text-muted);">Đã gán: <strong style="color:#fff;">1,187 đơn</strong> · Đã giao TC: <strong style="color:var(--accent-lime);">564 đơn</strong> · LTC: <strong style="color:var(--accent-rose);">192 đơn</strong></div>
          <div style="color:var(--accent-lime); margin-top:3px; font-weight:600;">🎯 Quy đổi Gap: Còn thiếu đúng 84 đơn để chạm mốc thưởng ca chiều!</div>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-dim);">
        <span style="color:var(--accent-lime);">✓ Hành động: Điều chuyển 3 bưu tá tuyến vắng hỗ trợ</span>
        <span style="font-family:var(--font-mono); color:var(--accent-cyan);">Card PNG Realtime</span>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Trước đây, Ban Giám đốc và Quản lý khu vực (AM) chỉ theo dõi con số % GTC chung chung của bưu cục một cách thụ động vào cuối ngày. AM không nắm được trong từng ca bưu tá nào đang giao tốt, bưu tá nào đang đuối sản lượng, và quan trọng nhất: <strong>Bưu cục còn thiếu chính xác bao nhiêu đơn nữa thì đạt chỉ tiêu ngày?</strong>
        </p>
        <p class="m-text" style="margin-top:8px;">
          Việc thiếu thông tin định lượng theo thời gian thực khiến AM chỉ đạo chung chung ("hãy cố gắng lên"), bưu tá không có mốc cụ thể để phấn đấu và thường để lỡ cơ hội bứt phá chỉ tiêu trong các khung giờ giao hàng buổi chiều.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán & Insight bóc tách dữ liệu</h4>
        <p class="m-text">Thủy xây dựng hệ thống kết hợp tự động giữa <strong>Năng Suất Bưu Tá Real-time</strong> và <strong>Mục Tiêu Target GTC Bưu Cục</strong>:</p>
        <ul class="m-list">
          <li><strong>Theo dõi tiến độ bưu tá theo thời gian thực:</strong> Đọc dữ liệu phân công và sản lượng giao thực tế của từng nhân viên giao hàng từ Google Sheets theo từng khung giờ.</li>
          <li><strong>Tính toán số đơn còn thiếu (Gap to Target):</strong> Tự động tính toán mốc mục tiêu phù hợp với thực tế bưu cục và quy đổi thành con số đơn hàng cụ thể: <code>Số đơn cần giao thêm = (Target % * Tổng đơn gán) - Số đơn đã giao thành công</code>.</li>
          <li><strong>Render thẻ ảnh trực quan (Card PNG):</strong> Tự động dựng thẻ ảnh tông màu cam/vàng kim sang trọng hiển thị danh sách từng bưu tá và bảng tính số đơn còn thiếu của bưu cục.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🎯 Quyết định & Hành động can thiệp (Actionable Decision)</h4>
        <p class="m-text">
          Vào các khung giờ then chốt 11h30, 15h00 và 18h00, bot tự động bắn thẻ ảnh trực tiếp vào nhóm chat GTalk của từng AM. AM mở ảnh ra là thấy ngay: <em>"Bưu cục còn thiếu đúng 84 đơn nữa là chạm chỉ tiêu thưởng"</em>, kèm danh sách các bưu tá còn nhiều đơn trên tuyến. AM lập tức điều chuyển nhân sự tuyến vắng sang hỗ trợ tiếp ứng để dứt điểm chỉ tiêu ngay trong ca phát.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Minh bạch hóa 100%</strong> năng suất giao hàng của đội ngũ bưu tá theo từng giờ làm việc.</li>
          <li>Biến chỉ tiêu % mơ hồ thành <strong>con số đơn hàng cụ thể (Actionable Metric)</strong>, giúp AM và bưu tá có mục tiêu rõ ràng để hoàn thành.</li>
          <li>Gia tăng đáng kể tỷ lệ giao thành công (GTC) toàn vùng vào các khung giờ chốt sổ buổi chiều.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          Lastmile Core API Integration • Real-time Target Engine • Headless Chromium Card Generator (Playwright & Pillow) • GTalk Regional Webhook.
        </p>
      </div>
    `
  },

  3: {
    id: 'NTB-AGING-03',
    badge: 'CASE 03 · INVENTORY CONTROL · CLAIMS REDUCTION',
    title: 'Push Đơn Tồn Kho: Aging Lưu Bãi, Treo Luân Chuyển (LC) & Pending Lấy',
    role: 'Kiểm Soát Hàng Lưu Bãi & Ngăn Ngừa Bồi Thường Hàng Hóa · Python Pandas, JSON Snapshots, Automated Color Table',
    desc: 'Quét các nút thắt nghẽn kho bãi: Đơn lưu bãi quá hạn (>3N, >5N, >8N), đơn kẹt xe tải luân chuyển liên tỉnh và pending lấy; thiết lập công thức "Tỷ lệ xử lý đơn tồn (Assignment Rate)" của AM để dứt điểm đơn siêu trễ, giảm hàng trăm triệu tiền đền bù hàng hư.',
    metrics: [
      { val: '-65% Đơn >8N', lbl: 'Giảm mạnh hàng tồn siêu trễ' },
      { val: 'Hàng Trăm Triệu', lbl: 'Tiết kiệm chi phí đền bù hư hỏng / tháng' },
      { val: '70% Cut-off', lbl: 'Ngưỡng cảnh báo kỷ luật Assignment Rate' }
    ],
    tech: ['Python 3.11', 'Pandas Analytics', 'JSON Delta Snapshots', 'Luân Chuyển & Pending Pipeline', 'Google Chat Broadcast'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-amber); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#f59e0b; border-radius:50%; box-shadow:0 0 8px #f59e0b;"></span>
          QUÉT ĐIỂM NGHẼN TỒN KHO, TREO LC & PENDING LẤY
        </span>
      </div>
      <div style="background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.25); border-radius:8px; padding:10px; margin-bottom:10px;">
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; text-align:center; margin-bottom:8px;">
          <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:4px;"><div style="color:var(--accent-rose); font-weight:700;">Aging &gt;8N</div><div style="font-size:0.65rem; color:#888;">Nguy cơ đền bù 70%</div></div>
          <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:4px;"><div style="color:var(--accent-amber); font-weight:700;">Treo Luân Chuyển</div><div style="font-size:0.65rem; color:#888;">Kẹt kho trung chuyển</div></div>
          <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:4px;"><div style="color:var(--accent-cyan); font-weight:700;">Pending Lấy</div><div style="font-size:0.65rem; color:#888;">Trễ SLA Shop gửi</div></div>
        </div>
        <div style="font-size:0.73rem; background:rgba(0,0,0,0.4); padding:6px 10px; border-radius:4px; display:flex; justify-content:space-between;">
          <span>Công thức kỷ luật AM:</span>
          <span style="color:var(--accent-lime); font-family:var(--font-mono); font-weight:700;">Assignment Rate = Đơn gán / Tổng tồn AM</span>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-dim);">
        <span style="color:var(--accent-rose);">⚠️ Cảnh báo đỏ nếu Assignment Rate &lt; 70%</span>
        <span style="color:var(--accent-cyan); font-family:var(--font-mono);">GTalk Lãnh Đạo Vùng</span>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Hàng lưu kho quá hạn (Aging) và đơn hàng bị ách tắc giữa các mắt xích là "cơn ác mộng" vận hành. Khi hàng nằm kho từ 8 đến 10 ngày trở lên, nguy cơ người mua từ chối nhận hàng hoặc hàng hóa bị móp méo, hư hỏng trong quá trình lưu bãi tăng vọt lên tới 70%, khiến công ty phải đền bù toàn bộ giá trị.
        </p>
        <p class="m-text" style="margin-top:8px;">
          Bên cạnh đó, các kiện hàng bị "treo luân chuyển" giữa các trạm xe tải và đơn pending lấy chưa kịp gom từ Shop cũng gây nghẽn dòng hàng liên hoàn nếu không được giám sát và thúc đẩy liên tục.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán & Insight bóc tách dữ liệu</h4>
        <p class="m-text">Thủy xây dựng hệ thống bóc tách dữ liệu đa chiều để giải quyết triệt để tồn đọng:</p>
        <ul class="m-list">
          <li><strong>Phân tầng dải ngày lưu bãi:</strong> Tự động bóc tách và phân loại hàng tồn theo các dải nguy hiểm: &gt;3N, &gt;5N, &gt;8N và &gt;10N.</li>
          <li><strong>Theo dõi điểm nghẽn luân chuyển & pending lấy:</strong> Quét các mã vận đơn bị đứng im quá 24h trên tuyến xe tải hoặc các đơn Shop đã báo lấy nhưng chưa có bưu tá tới tiếp nhận.</li>
          <li><strong>Định nghĩa chỉ số Assignment Rate:</strong> Thiết lập công thức đo lường mức độ quyết liệt của từng AM: <code>Assignment Rate = (Số đơn tồn đã được phân công bưu tá đi phát) / (Tổng số đơn tồn hiện hữu trong kho)</code>.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🎯 Quyết định & Hành động can thiệp (Actionable Decision)</h4>
        <p class="m-text">
          Hệ thống tự động render bảng phân tích màu sắc và xếp hạng công khai mức độ giải quyết hàng tồn của 19 AMs + 2 SUPs lên nhóm GTalk lãnh đạo Vùng. AM nào có tỷ lệ gán đơn &lt; 70% phải giải trình trực tiếp lý do tại sao để đơn hàng nằm im trong kho mà không cho bưu tá xuất phát. Đồng thời cảnh báo ngay trạm xe tải đang bị treo hàng luân chuyển để điều phối giải phóng kho.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Cắt giảm 65%</strong> lượng đơn tồn kho siêu trễ (&gt;8 ngày) trên toàn địa bàn 5 tỉnh Nam Trung Bộ.</li>
          <li><strong>Tiết kiệm hàng trăm triệu đồng</strong> chi phí đền bù hàng hóa hỏng/vỡ mỗi tháng cho công ty.</li>
          <li>Giải phóng diện tích kho bãi tại 86 bưu cục và các kho trung chuyển, nâng cao tốc độ quay vòng của luồng hàng hóa liên tỉnh.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          Aging & Transit Analysis Engine • Heatmap Matrix Generator • Snapshot Cache System • GTalk Automated Dispatch.
        </p>
      </div>
    `
  },

  4: {
    id: 'NTB-BATON-04',
    badge: 'CASE 04 · OPERATIONS RISK · TARGET CLEAR & AUTO OFF',
    title: 'Cảnh Báo Bưu Cục Bất Ổn & Đề Xuất Tự Động OFF Tuyến Bảo Vệ Trạm',
    role: 'Giám Sát Bưu Cục Bất Ổn & Đề Xuất Tắt Tuyến TMĐT Bảo Vệ Trạm · Python, GSpread, Bot rqoff',
    desc: 'Giải quyết triệt để bài toán cảnh báo thụ động: Thay vì chỉ gắn nhãn bưu cục bị "Bất ổn", hệ thống đối soát Backlog Lastmile (BL LM), BL Aging >5 ngày, BL KTC cùng tỉnh với sản lượng tạo mới và GTC trung bình 7 ngày để tự động tính ra chính xác SỐ LƯỢNG ĐƠN CẦN CLEAR TRONG NGÀY (Target LM & Target KTC) giúp bưu cục thoát khỏi danh sách cảnh báo đỏ. Đồng thời Bot rqoff tự động đề xuất OFF tuyến (tắt nhận đơn sàn TMĐT Shopee/Lazada vào bưu cục) để bảo vệ trạm không bị vỡ.',
    metrics: [
      { val: '3 Cấp Phân Nhóm', lbl: 'Top Bất Ổn · Nhảy Nhóm · Cảnh Báo' },
      { val: 'Target Clear Cụ Thể', lbl: 'Định lượng số đơn cần xử lý trong ngày' },
      { val: 'Bot OFF Tuyến rqoff', lbl: 'Tự động đề xuất tắt tuyến bảo vệ trạm' }
    ],
    tech: ['Python 3.11', 'GSpread API (Service Account)', 'Playwright Headless Cards', 'Backlog & Aging Multi-factor Model', 'Bot rqoff & rqoff_plan', 'Telegram Bot API / GTalk'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-sky, #38bdf8); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#38bdf8; border-radius:50%; box-shadow:0 0 8px #38bdf8;"></span>
          HỆ THỐNG ĐỊNH LƯỢNG CLEAR ĐƠN & BOT OFF TUYẾN
        </span>
      </div>
      <div style="background:rgba(56,189,248,0.06); border:1px solid rgba(56,189,248,0.25); border-radius:8px; padding:10px; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--text-main);">Định lượng đơn cần clear để thoát bất ổn:</span>
          <span style="font-family:var(--font-mono); font-size:0.68rem; color:var(--accent-rose); background:rgba(244,63,94,0.15); padding:2px 6px; border-radius:4px;">CẦN CAN THIỆP NGAY</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr; gap:5px; font-size:0.73rem;">
          <div style="background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:4px; display:flex; justify-content:space-between;">
            <span>1. Target Clear Đơn Lastmile:</span>
            <span style="color:var(--accent-lime); font-family:var(--font-mono); font-weight:700;">max(Aging_5N - 10% BL, BL + Tạo_7D - 1.8*GTC_7D)</span>
          </div>
          <div style="background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:4px; display:flex; justify-content:space-between;">
            <span>2. Tự động đề xuất OFF tuyến (rqoff):</span>
            <span style="color:var(--accent-amber); font-family:var(--font-mono); font-weight:700;">Tắt tuyến Shopee/Lazada bưu cục quá tải</span>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-dim);">
        <span style="color:var(--accent-lime);">✓ Tự động Tag AM phụ trách & Gửi thẻ ảnh</span>
        <span style="color:var(--accent-cyan); font-family:var(--font-mono);">bc_baton_report.png</span>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Tại các bưu cục bị nghẽn vận hành (Backlog Lastmile dồn ứ, hàng tồn Aging quá 5 ngày hoặc hàng trung chuyển KTC cùng tỉnh bị ứ đọng), nếu chỉ gửi một thông báo chung chung là "Bưu cục X đang rơi vào nhóm Bất ổn" thì Quản lý khu vực (AM) và Trưởng bưu cục sẽ rơi vào tình trạng lúng túng, không biết phải ưu tiên xử lý luồng đơn nào trước và cần giao bao nhiêu đơn để trạm trở lại ngưỡng an toàn.
        </p>
        <p class="m-text" style="margin-top:8px;">
          Nếu lượng hàng từ sàn TMĐT (Shopee, Lazada) vẫn tiếp tục đổ dồn về trong khi trạm đang kẹt cứng, bưu cục sẽ rơi vào tình trạng "vỡ trạm", sụp đổ hoàn toàn chất lượng giao nhận của toàn tỉnh.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán & Insight bóc tách dữ liệu</h4>
        <p class="m-text">Thủy nâng cấp mô hình phân tích bất ổn thành công cụ định lượng hành động cụ thể kết hợp bot OFF tuyến:</p>
        <ul class="m-list">
          <li><strong>Phân nhóm cảnh báo 3 cấp độ:</strong> Tự động bóc tách và xếp loại danh sách bưu cục thành: (1) Nằm TOP Bất Ổn; (2) Chuẩn Bị Nhảy Nhóm; (3) Cấp Cảnh Báo.</li>
          <li><strong>Thuật toán tính toán số lượng đơn cần Clear trong ngày:</strong>
            <br>• Đối soát giữa <strong>Backlog LM hiện tại, Tồn Aging >5 ngày, Tồn KTC cùng tỉnh</strong> với <strong>Mức tạo đơn mới TB 7 ngày</strong> và <strong>Sản lượng GTC trung bình 7 ngày</strong>.
            <br>• Tính toán mục tiêu: <code>Target_LM = max(BL_LM_5ngay - 10%*BL_LM, BL_LM + Tao_Avg_7D - 1.8*GTC_Avg_7D)</code>. Con số trả về chính là số lượng kiện hàng chính xác cần giải tỏa ngay trong ngày để bưu cục thoát khỏi ngưỡng bất ổn!
          </li>
          <li><strong>Hệ Thống Tự Động Đề Xuất OFF Tuyến:</strong> Khi phát hiện bưu cục có nguy cơ vỡ trạm, hệ thống tự động quét cơ cấu phường xã và sản lượng Shopee 7 ngày để lên danh sách các tuyến cần tạm thời OFF (tắt luồng nhận đơn TMĐT) để trạm có không gian giải phóng hàng tồn.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🎯 Quyết định & Hành động can thiệp (Actionable Decision)</h4>
        <p class="m-text">
          Hệ thống tự động render thẻ ảnh HTML/CSS tổng hợp và gửi lên Telegram/GTalk điều hành Vùng, Tag đích danh từng AM phụ trách kèm số lượng đơn cần xử lý. Đồng thời đề xuất danh sách OFF tuyến gửi Ban Giám đốc phê duyệt ngay đầu ngày để bảo vệ an toàn công suất trạm.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li>Chuyển hóa cảnh báo từ dạng "thông tin thụ động" sang <strong>mục tiêu hành động định lượng chính xác (Actionable KPI)</strong>.</li>
          <li>Chủ động bảo vệ trạm bằng cơ chế OFF tuyến linh hoạt, dập tắt nguy cơ vỡ trạm trước khi xảy ra sự cố.</li>
          <li>Bảo vệ cam kết chất lượng dịch vụ (SLA) với các sàn thương mại điện tử lớn.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          Early Warning Operational Engine • Thuật toán tối ưu OFF tuyến Shopee • Google Sheets Realtime API • Playwright Headless Card Generator.
        </p>
      </div>
    `
  },

  5: {
    id: 'NTB-ATTEND-05',
    badge: 'CASE 05 · OPERATIONS DISCIPLINE · SQLITE ENGINE',
    title: 'Điểm Danh Quân Số & Nhắc Báo Cáo 5 Mốc Vận Hành (Lưu Trữ SQLite)',
    role: 'Kỷ Luật Thép Vận Hành · SQLite Database, Python Automation, GSpread Sync, Automated Penalty Engine',
    desc: 'Chuẩn hóa 5 mốc cut-off chiến lược trong ngày (08:00, 10:00, 11:00, 16:00, 20:00) cho 86 bưu cục. Tích hợp cơ sở dữ liệu SQLite (diem_danh.db) ghi nhận chính xác thời gian báo cáo đến từng giây, đếm ngược nhắc giờ trước 15 phút và tự động chấm phạt vi phạm minh bạch tuyệt đối.',
    metrics: [
      { val: '98.2% Tuân thủ', lbl: 'Tăng từ 65% trước khi có bot' },
      { val: '5 Mốc Giờ Vàng', lbl: '08h · 10h · 11h · 16h · 20h' },
      { val: 'SQLite Database', lbl: 'Ghi nhận nhật ký chính xác đến giây' }
    ],
    tech: ['SQLite 3 (diem_danh.db)', 'Python 3.11', 'Google Sheets API (gspread)', 'Telegram / GTalk Bots', 'Jinja2 Thẻ Ảnh Recap', 'Cron/Task Scheduler'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#06b6d4; border-radius:50%; box-shadow:0 0 8px #06b6d4;"></span>
          HỆ THỐNG 5 MỐC CUT-OFF & DATABASE SQLITE
        </span>
        <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-dim);">DB: diem_danh.db</span>
      </div>
      <div style="background:rgba(6,182,212,0.06); border:1px solid rgba(6,182,212,0.25); border-radius:8px; padding:10px; margin-bottom:10px;">
        <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:4px; text-align:center; font-size:0.72rem; margin-bottom:8px;">
          <div style="background:rgba(0,0,0,0.3); padding:5px 2px; border-radius:4px;"><strong style="color:var(--accent-emerald);">08:00</strong><div style="font-size:0.62rem; color:#888;">Quân số</div></div>
          <div style="background:rgba(0,0,0,0.3); padding:5px 2px; border-radius:4px;"><strong style="color:var(--accent-cyan);">10:00</strong><div style="font-size:0.62rem; color:#888;">Điểm nóng</div></div>
          <div style="background:rgba(0,0,0,0.3); padding:5px 2px; border-radius:4px;"><strong style="color:var(--accent-lime);">11:00</strong><div style="font-size:0.62rem; color:#888;">TTS Ca 1</div></div>
          <div style="background:rgba(0,0,0,0.3); padding:5px 2px; border-radius:4px;"><strong style="color:var(--accent-amber);">16:00</strong><div style="font-size:0.62rem; color:#888;">TTS Ca 2</div></div>
          <div style="background:rgba(0,0,0,0.3); padding:5px 2px; border-radius:4px;"><strong style="color:#c084fc;">20:00</strong><div style="font-size:0.62rem; color:#888;">LTC đêm</div></div>
        </div>
        <div style="font-size:0.72rem; background:rgba(0,0,0,0.3); padding:6px 8px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
          <span style="color:var(--text-muted);">Cơ chế xử phạt:</span>
          <span style="color:var(--accent-rose); font-weight:700;">Trễ &gt; 5 phút tự động tính phạt & đẩy Sheets</span>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-dim);">
        <span style="color:var(--accent-lime);">✓ Tự động loại trừ phép hợp lệ</span>
        <span style="color:var(--accent-cyan); font-family:var(--font-mono);">Daily Recap Card PNG</span>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Tại Nam Trung Bộ, mỗi Quản lý khu vực (AM) phụ trách từ 5 đến 10 bưu cục. Trước đây, việc nộp báo cáo quân số, tiến độ giao nhận diễn ra rất tùy tiện. Nếu một vài AM nộp báo cáo trễ 30 phút, Ban Giám Đốc sẽ hoàn toàn bị "mù thông tin" điều hành trong 4 tiếng tiếp theo.
        </p>
        <p class="m-text" style="margin-top:8px;">
          Việc theo dõi, gọi điện nhắc nhở thủ công vừa tốn thời gian, vừa dễ gây mất lòng và phát sinh tranh cãi về việc "ai nộp trước, ai nộp sau".
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán & Insight bóc tách dữ liệu</h4>
        <p class="m-text">Thủy chuẩn hóa toàn diện 5 mốc cut-off chiến lược trong ngày:</p>
        <ul class="m-list">
          <li><strong>08:00 (Đầu ngày):</strong> Chốt quân số bưu tá đi làm thực tế và tỷ lệ hàng đã cập bến bưu cục.</li>
          <li><strong>10:00 (Điểm nóng):</strong> Quét bưu cục có nguy cơ ùn ứ ca sáng để điều phối xe tải trung chuyển.</li>
          <li><strong>11:00 (TTS Ca 1):</strong> Đánh giá kết quả giao ca sáng trước khi shipper nghỉ trưa.</li>
          <li><strong>16:00 (TTS Ca 2):</strong> Quyết định có cần kích hoạt ca 3 tăng cường buổi tối hay không.</li>
          <li><strong>20:00 (LTC Đêm):</strong> Chốt số liệu bàn giao cho đội ngũ xe tải luân chuyển liên tỉnh.</li>
          <li><strong>Cơ sở dữ liệu SQLite:</strong> Sử dụng SQLite Database (<code>diem_danh.db</code>) ghi nhận chính xác thời gian báo cáo đến từng giây, tự động liên kết danh sách nghỉ phép để loại trừ các trường hợp hợp lệ.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🎯 Quyết định & Hành động can thiệp (Actionable Decision)</h4>
        <p class="m-text">
          Bot đếm ngược và ping nhắc nhở đích danh trước 15 phút. Đúng giờ cut-off, bot tự động quét cơ sở dữ liệu, lọc danh sách AM vi phạm, tính toán số tiền phạt theo quy chế công ty và đẩy thẳng lên Google Sheet <em>"Theo Dõi Phạt AM"</em> công khai. Cuối ngày, bot render thẻ ảnh tổng kết Daily Recap gửi lãnh đạo vùng.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Tỷ lệ nộp báo cáo đúng hạn tăng vọt từ 65% lên 98.2%</strong> trên toàn bộ 86 bưu cục.</li>
          <li>Xóa bỏ 100% tình trạng "mù thông tin" của Ban Giám đốc trong các khung giờ điều hành then chốt.</li>
          <li>Thiết lập văn hóa kỷ luật thép minh bạch, công bằng tuyệt đối và không có bất kỳ tranh cãi nào.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          Telegram Bot Polling Engine • SQLite Attendance Database • Google Sheets Realtime Sync • Daily Recap Card Renderer.
        </p>
      </div>
    `
  },

  6: {
    id: 'NTB-FIELD-06',
    badge: 'CASE 06 · FIELD OPERATIONS · GEO CHECK-IN',
    title: 'Số Hóa Giám Sát Đi Thị Trường Cho HRBP & Quản Lý Vận Hành (SUP)',
    role: 'Quản Trị Nhân Sự & Giám Sát Thực Địa Bưu Cục · Telegram Geo Check-in, Google Sheets Master',
    desc: 'Số hóa toàn diện lịch trình công tác thực địa của đội ngũ HRBP (Nhân sự) và Supervisor (Giám sát vận hành): Check-in vị trí thực tế tại bưu cục bằng GPS, ghi nhận biên bản đánh giá chất lượng nhân sự, an ninh, cơ sở vật chất và tiêu chuẩn 5S ngay tại hiện trường về Google Sheets thời gian thực. (Tích hợp thêm module cảnh báo quá hạn sàn TMĐT ODR/OPR và xử lý Ticket khiếu nại).',
    metrics: [
      { val: 'Real-time', lbl: 'Định vị GPS check-in thực tế' },
      { val: '100% Số Hóa', lbl: 'Biên bản kiểm tra bưu cục' },
      { val: '5 Tỉnh NTB', lbl: 'Minh bạch lịch trình công tác' }
    ],
    tech: ['Telegram Geolocation', 'Mobile Form Workflow', 'HRBP & SUP Tracker', 'ODR/OPR Sàn TMĐT', 'Ticket Alerting', 'Google Sheets Integration'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-purple); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#a855f7; border-radius:50%; box-shadow:0 0 8px #a855f7;"></span>
          NHẬT KÝ CHECK-IN THỊ TRƯỜNG HRBP & SUP
        </span>
      </div>
      <div style="background:rgba(168,85,247,0.06); border:1px solid rgba(168,85,247,0.25); border-radius:8px; padding:10px; margin-bottom:10px; font-size:0.73rem; line-height:1.6;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="color:var(--text-main); font-weight:700;">📍 Điểm kiểm tra: Hub Đà Lạt (Lâm Đồng)</span>
          <span style="color:var(--accent-lime); font-family:var(--font-mono);">GPS Verified ✓</span>
        </div>
        <div style="color:var(--text-muted); background:rgba(0,0,0,0.3); padding:6px 8px; border-radius:4px;">
          Nhân sự đánh giá: HRBP Nguyễn Văn A · Biên bản: Cơ sở vật chất 5S đạt 95%, quân số đi làm đủ 100%, không phát sinh vi phạm an ninh kho bãi.
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-dim);">
        <span style="color:var(--accent-lime);">✓ Đồng bộ dữ liệu về Google Sheet tức thì</span>
        <span style="color:var(--accent-cyan); font-family:var(--font-mono);">5 Tỉnh Nam Trung Bộ</span>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Đội ngũ HRBP (Đối tác Nhân sự) và Supervisor (Giám sát vận hành) thường xuyên phải di chuyển công tác thực địa tại 86 bưu cục, 1 kho chuyển tiếp và 4 kho trung chuyển trải dài trên 5 tỉnh. Trước đây, việc quản lý lịch trình công tác phụ thuộc hoàn toàn vào báo cáo miệng hoặc tin nhắn rời rạc, Ban Giám đốc không thể kiểm chứng được nhân sự có thực sự xuống địa bàn kiểm tra bưu cục hay không và các biên bản hiện trường thường bị thất lạc.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán & Insight bóc tách dữ liệu</h4>
        <p class="m-text">Thủy xây dựng bot Telegram Check-in số hóa toàn bộ quy trình kiểm tra thực địa:</p>
        <ul class="m-list">
          <li><strong>Xác thực tọa độ GPS (Geolocation Verification):</strong> Bắt buộc gửi vị trí trực tiếp (Live Location) qua Telegram khi đến bưu cục để đối chiếu với tọa độ chuẩn trên hệ thống.</li>
          <li><strong>Biểu mẫu đánh giá chuẩn hóa:</strong> Số hóa biên bản kiểm tra gồm các tiêu chí: quân số đi làm, kỷ luật vệ sinh 5S kho bãi, an ninh cơ sở vật chất và các vấn đề cần hỗ trợ.</li>
          <li><strong>Đồng bộ Google Sheets thời gian thực:</strong> Tự động ghi nhận thông tin, tạo nhật ký công tác minh bạch và tổng hợp báo cáo đánh giá chất lượng bưu cục toàn vùng.</li>
          <li><strong>Mở rộng giám sát chuyên sâu:</strong> Kết hợp cùng các bot bổ trợ: Cảnh báo đơn quá hạn sàn TMĐT (Shopee, TikTok Shop, Lazada - ODR/OPR) và Bot cảnh báo ticket khiếu nại khách hàng.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🎯 Quyết định & Hành động can thiệp (Actionable Decision)</h4>
        <p class="m-text">
          Ban Giám đốc có ngay một trang tổng quan minh bạch về toàn bộ lịch trình công tác của đội ngũ HRBP và SUP trên cả 5 tỉnh. Các vấn đề tồn đọng tại bưu cục (thiếu nhân sự, mặt bằng chật hẹp, vi phạm an ninh) được ghi nhận tức thì để lãnh đạo đưa ra chỉ đạo giải quyết ngay trong ngày.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Minh bạch hóa 100%</strong> hoạt động giám sát thực địa của đội ngũ quản lý tuyến đầu.</li>
          <li>Rút ngắn thời gian phát hiện và xử lý sự cố tại bưu cục từ vài tuần xuống còn vài giờ.</li>
          <li>Nâng cao kỷ luật tuân thủ tiêu chuẩn vận hành và 5S tại tất cả 86 bưu cục và hệ thống kho toàn vùng.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          Field Supervisor Tracking Bot • Kaizen Automation Pipeline • Ticket Resolution Webhook • Telegram Bot API & GSpread.
        </p>
      </div>
    `
  }
,
  7: {
    id: 'NTB-BI-07',
    badge: 'CASE 07 · EXECUTIVE BI · WEEKLY OPS DASHBOARD',
    title: 'Dashboard (DB) Họp Vận Hành & Kinh Doanh Trực Quan Đa Chiều',
    role: 'Nền tảng BI phục vụ Ban Giám Đốc Vùng & 19 AMs + 2 SUPs (namtrungbo.vercel.app/hop)',
    deepDetail: `
      <div style="margin-bottom: 20px;">
        <a href="https://namtrungbo.vercel.app/hop" target="_blank" rel="noopener noreferrer" class="bc-link-pill" style="font-size:0.85rem; padding:8px 16px;">
          🌐 Mở Trực Tiếp Dashboard Họp Tuần (namtrungbo.vercel.app/hop) ↗
        </a>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Trước đây, các cuộc họp giao ban đầu tuần của Vùng Nam Trung Bộ phụ thuộc vào việc ghép nối hàng chục file Excel và các slide PowerPoint tĩnh tốn hơn 12 tiếng chuẩn bị mỗi cuối tuần. Số liệu bị phân mảnh, Ban Giám Đốc không thể nhìn thấy ngay tương quan giữa <strong>Sản lượng giao (380k đơn)</strong>, <strong>tỷ lệ %GTC (60.4%)</strong>, <strong>%ODR đúng hẹn (92.0%)</strong> và <strong>%LTC lấy thành công (90.8%)</strong>, cũng như không thể drill-down ngay lập tức xuống từng bưu cục hay từng quản lý khu vực (AM) khi có chỉ số rớt đáy.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💡 Giải pháp can thiệp & Kiến trúc Dashboard Trực quan</h4>
        <p class="m-text">
          Thủy đã trực tiếp kiến trúc và phát triển hệ thống <strong>Dashboard Họp Tuần Vận Hành & Kinh Doanh</strong> triển khai trên Vercel:
        </p>
        <ul class="m-list">
          <li><strong>Bản đồ nhiệt & Tổng hợp trọng tâm:</strong> Tự động hiển thị tóm lược các chỉ số cốt lõi tuần W42 so với tuần W41 (+4.4% WoW), làm nổi bật ngay các thành tích vượt mốc và các điểm cần báo động đỏ.</li>
          <li><strong>Phân tích chuyên sâu 8 Tab chiến lược:</strong> Tổng quan Vùng, Sản lượng giao, %GTC Tổng, %GTC TikTok Shop ca 1 (Target ≥ 76%), % Gán vận hành, %ODR Đúng hẹn, %LTC Lấy thành công và %OPR TikTok Shop.</li>
          <li><strong>Bộ lọc tương tác tức thời:</strong> Hỗ trợ Ban Giám Đốc chuyển đổi góc nhìn theo 5 Tỉnh thành và từng người trong 20 AMs chỉ bằng một click chuột mà không cần tải lại trang.</li>
          <li><strong>Giám sát dòng tiền tiền mặt COD:</strong> Theo dõi tỷ lệ tiền mặt COD (41.0%) so với QR/Chuyển khoản (59.0%), kiểm soát chặt chẽ ngân quỹ toàn mạng lưới.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Tiết kiệm 100%</strong> thời gian làm slide họp thủ công mỗi tuần của đội ngũ trợ lý và AM.</li>
          <li><strong>Rút ngắn 50%</strong> thời lượng cuộc họp giao ban đầu tuần nhờ dữ liệu trực quan, tập trung can thiệp trúng đích thay vì tranh cãi về tính chính xác của số liệu.</li>
          <li>Nâng tỷ lệ %GTC TikTok Shop ca 1 đạt <strong>79.3%</strong> (vượt xa cam kết Target SLA 76.0%).</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật</h4>
        <p class="m-text">
          Interactive BI Web App • Vercel Serverless Architecture • Chart.js Data Visualization • Automated ETL Data Pipeline • Multi-level AM Drill-down.
        </p>
      </div>
    `
  },

  8: {
    id: 'NTB-KTC-08',
    badge: 'CASE 08 · LOGISTICS TRANSIT · TRUCK CAPACITY',
    title: 'Đo Lường Tỷ Lệ Lấp Đầy Thùng Xe KTC & Cân Đối Backlog Xuất - Nhập 4 HUB',
    role: 'Tối ưu hóa tải trọng vận tải & Năng lực thông lượng tại 4 HUB Trung Chuyển',
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Tại 4 Kho Trung Chuyển (HUB Khánh Hòa, HUB Bình Thuận, HUB Đức Trọng, HUB Đắk Nông) và 1 Kho Chuyển Tiếp, tình trạng xe tải luân chuyển liên tỉnh xuất bến với tỷ lệ lấp đầy thấp (< 60% thể tích CBM thùng xe) gây lãng phí hàng trăm triệu đồng chi phí nhiên liệu mỗi tháng. Ngược lại, vào các đợt Mega Sale, các HUB thường xuyên bị ứ đọng Backlog hàng nghìn kiện do không cân đối kịp thời giữa luồng hàng nhập (Inbound) và năng lực xuất tải (Outbound).
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💡 Giải pháp can thiệp & Thuật toán Fill Rate</h4>
        <ul class="m-list">
          <li><strong>Bot Giám Sát Tỷ Lệ Lấp Đầy Thùng Xe:</strong> Tự động tính toán tỷ lệ CBM và tải trọng thực tế của từng chuyến xe trước khi lăn bánh. Cảnh báo các xe chạy rỗng để điều phối ghép tải hoặc điều chuyển xe trọng tải nhỏ hơn phù hợp.</li>
          <li><strong>Báo Cáo Cân Đối Backlog Xuất - Nhập 4 Mốc/Ngày:</strong> Bóc tách liên tục luồng hàng Inbound/Outbound, phát hiện ngay các nút thắt cổ chai chia chọn tại trạm trung chuyển để tăng ca nhân sự kịp thời.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Tiết kiệm 15%</strong> chi phí vận tải và khấu hao đội xe luân chuyển toàn vùng.</li>
          <li><strong>Tăng tỷ lệ lấp đầy thùng xe bình quân</strong> từ 64% lên 86.5%.</li>
          <li>Triệt tiêu nguy cơ nghẽn tải luân chuyển, bảo vệ thời gian toàn trình SLA giao hàng.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật</h4>
        <p class="m-text">
          CBM & Weight Volumetric Analytics • HUB Scanner API • Transit Bottleneck Early Warning • GTalk Dispatch Integration.
        </p>
      </div>
    `
  },

  9: {
    id: 'NTB-AUDIT-09',
    badge: 'CASE 09 · INBOUND AUDIT & CASH RECONCILIATION',
    title: 'Kiểm Soát Toàn Trình: Bắn Kiểm Tải Hàng & Cảnh Báo Chưa Tick Phiếu Thu Tiền Mặt',
    role: 'Giám sát kỷ luật tiếp nhận hàng hóa & An toàn dòng tiền ngân quỹ bưu cục',
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Tại khâu tuyến đầu cơ sở, hai rủi ro lớn nhất làm suy giảm uy tín và thất thoát tài chính là: (1) Xe tải đã chở hàng đến bưu cục nhưng nhân viên không chịu "bắn kiểm nhập kho" (ngâm tải làm chậm tiến độ giao hàng trong ngày), và (2) Tiền mặt COD bưu tá thu về nộp tại trạm nhưng Trưởng bưu cục hoặc thủ quỹ chưa "tick xác nhận phiếu thu" trên hệ thống, dẫn đến sai lệch sổ sách và nguy cơ chiếm dụng công nợ.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💡 Giải pháp can thiệp tự động</h4>
        <ul class="m-list">
          <li><strong>Bot Cảnh Báo Chưa Bắn Kiểm:</strong> Đối chiếu lịch trình xe tải hạ hàng từ 4 HUB với dữ liệu quét mã kiện. Nếu sau 30 phút xe đến mà chưa phát sinh lượt quét bắn kiểm, bot lập tức ping khẩn cấp lên nhóm điều hành AM.</li>
          <li><strong>Bot Rà Soát Phiếu Thu Chưa Tick:</strong> Quét tự động vào cuối ca trưa (12:00) và chốt ca tối (20:30), liệt kê danh sách các bưu cục còn tồn đọng phiếu thu chưa xác nhận để Kế toán Vùng và AM can thiệp lập tức.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>100% chuyến xe hạ tải</strong> được bắn kiểm nhập kho trong vòng 30 phút, đảm bảo đơn hàng xuất tuyến đúng giờ.</li>
          <li><strong>0 đồng</strong> thất thoát công nợ do chậm nộp hoặc tồn đọng phiếu thu tiền mặt.</li>
          <li>Nâng cao tính kỷ luật và tính minh bạch tuyệt đối giữa khối Bưu cục cơ sở và Kế toán Vùng.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật</h4>
        <p class="m-text">
          Inbound Manifest Matcher • Real-time Cash Receipt Reconciliation • Automated GTalk Alerts • Google Sheets Accounting Sync.
        </p>
      </div>
    `
  },

  10: {
    id: 'NTB-NVPPT-10',
    badge: 'CASE 10 · LASTMILE PRODUCTIVITY · SHIPPER PERFORMANCE',
    title: 'Bóc Tách Chuyên Sâu Năng Suất Nhân Viên Phân Phát Tuyến (NVPPT) N-1',
    role: 'Tối ưu hóa hiệu suất giao nhận & Chuẩn hóa năng lực từng bưu tá',
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Đội ngũ hơn 640 bưu tá (NVPPT) trải rộng trên 86 bưu cục có khoảng cách năng suất rất lớn: có những bưu tá giao trên 120 đơn/ngày với %GTC > 98%, nhưng cũng có nhiều bưu tá chỉ đạt 40-50 đơn và thường xuyên tồn đọng đơn hoãn. Trước đây, AM không có công cụ bóc tách chi tiết từng cá nhân trong ngày hôm trước (N-1) để biết ai đuối tuyến, ai gặp sự cố giao lại nhiều lần để có phương án đào tạo hoặc cơ cấu lại tuyến phát.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💡 Giải pháp can thiệp tự động</h4>
        <ul class="m-list">
          <li><strong>Bóc tách năng suất N-1:</strong> Phân tích toàn diện sản lượng gán, số đơn giao thành công, số đơn thất bại, tỷ lệ %GTC và tốc độ giao đơn/giờ của từng bưu tá.</li>
          <li><strong>Phát hiện dị biệt (Outlier Detection):</strong> Tự động phân loại nhóm bưu tá xuất sắc (Top Performers) và nhóm đuối năng suất (Bottom Performers) kèm lý do cụ thể (tuyến đồi núi khó đi, đơn khách hẹn nhiều lần hay do thái độ giao hàng).</li>
          <li><strong>Bảng chỉ đạo hành động cho AM:</strong> Cung cấp danh sách bưu tá cần kèm cặp ngay đầu ngày để AM hướng dẫn kỹ năng hoặc điều phối bưu tá phụ tuyến hỗ trợ.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Tăng 22%</strong> năng suất bình quân của nhóm bưu tá yếu sau 2 tuần áp dụng kèm cặp.</li>
          <li><strong>Tăng tỷ lệ giao thành công lần đầu (%FD)</strong> lên 89.4% toàn mạng lưới.</li>
          <li>Gắn kết thu nhập của bưu tá với hiệu suất minh bạch, giảm tỷ lệ nghỉ việc tuyến đầu.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật</h4>
        <p class="m-text">
          Lastmile Production Core API • N-1 Daily ETL Pipeline • Outlier Detection Algorithm • Automated Performance Scorecard.
        </p>
      </div>
    `
  }
};
function initCaseStudies() {
  const caseCards = document.querySelectorAll('.case-card-grid-item');
  const modal = document.getElementById('modalCaseDetail');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalContent = document.getElementById('modalContent');
  const btnCloseCaseModal = document.getElementById('btnCloseCaseModal');

  function openCaseModal(caseId) {
    const data = CASE_DATA[caseId];
    if (!data || !modal) return;

    if (modalBadge) modalBadge.textContent = data.badge;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSubtitle) modalSubtitle.textContent = data.role;
    if (modalContent) modalContent.innerHTML = data.deepDetail;
    modal.showModal();
  }

  // Bind click & keyboard event to every case card
  caseCards.forEach((card) => {
    const caseId = parseInt(card.getAttribute('data-case'), 10);

    card.addEventListener('click', (e) => {
      openCaseModal(caseId);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCaseModal(caseId);
      }
    });
  });

  // Close Modal handlers
  if (btnCloseCaseModal && modal) {
    btnCloseCaseModal.addEventListener('click', () => modal.close());
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });
  }
}

function initCareerJourney() {
  const nodes = document.querySelectorAll('.journey-node');
  const jPeriod = document.getElementById('jPeriod');
  const jBadge = document.getElementById('jBadge');
  const jRole = document.getElementById('jRole');
  const jCompany = document.getElementById('jCompany');
  const jBullets = document.getElementById('jBullets');
  const jFooter = document.getElementById('jFooter');

  const chibi = document.getElementById('chibiCharacter');
  const chibiMsg = document.getElementById('chibiMsg');
  const chibiShirt = document.getElementById('chibiShirt');
  const chibiItem = document.getElementById('chibiItem');
  const ghnGate = document.getElementById('ghnGate');

  const btnNext = document.getElementById('btnChibiNext');
  const btnAuto = document.getElementById('btnChibiAuto');
  const btnReset = document.getElementById('btnChibiReset');
  const statusText = document.getElementById('chibiStatusText');

  let currentChibiIndex = CHIBI_STOPS.length - 1; // Default at Current (Stop 5)
  let autoTimer = null;

  function renderStopDetails(stopId, event) {
    const data = JOURNEY_STOPS[stopId];
    if (!data) return;

    nodes.forEach(n => {
      const nid = parseInt(n.getAttribute('data-stop'), 10);
      n.classList.toggle('active', nid === stopId);
    });

    if (jPeriod) jPeriod.textContent = data.period;
    if (jBadge) jBadge.textContent = data.badge;
    if (jRole) jRole.textContent = data.role;
    if (jCompany) jCompany.textContent = data.company;

    if (jBullets) {
      let awardHtml = '';
      if (data.awardBanner) {
        awardHtml = `
          <div class="award-banner-card">
            <div class="abc-trophy-wrap">
              <span class="abc-trophy-icon">🏆</span>
              <span class="abc-sparkle s1">✨</span>
              <span class="abc-sparkle s2">✨</span>
            </div>
            <div class="abc-content">
              <div class="abc-header">
                <span class="abc-tag">Vinh Danh Cá Nhân Xuất Sắc Toàn Diện</span>
                <h4 class="abc-title">${data.awardBanner.title}</h4>
              </div>
              <p class="abc-reason">${data.awardBanner.desc}</p>
            </div>
          </div>
        `;
      }

      jBullets.innerHTML = awardHtml + data.bullets.map(b => `<li>${b}</li>`).join('');
    }

    if (jFooter) {
      jFooter.innerHTML = `<span class="j-impact-tag"><strong>Tác động chính:</strong> ${data.impact}</span>`;
    }

    if (stopId === 4) {
      triggerAwardConfetti(event);
      if (window.soundFX && window.soundFX.playAwardChime) {
        window.soundFX.playAwardChime();
      }
    }
  }

  function walkChibiTo(index, event) {
    if (index < 0 || index >= CHIBI_STOPS.length) return;
    currentChibiIndex = index;
    const target = CHIBI_STOPS[index];

    if (chibi) {
      chibi.classList.add('walking');
      chibi.setAttribute('transform', `translate(${target.x}, ${target.y})`);
      if (chibiMsg) {
        chibiMsg.textContent = target.msg;
        const bubbleRect = chibi.querySelector('.chibi-bubble rect');
        if (bubbleRect) {
          const bw = Math.max(160, target.msg.length * 6.5 + 24);
          bubbleRect.setAttribute('x', -bw / 2);
          bubbleRect.setAttribute('width', bw);
        }
      }

      // Uniform color change
      if (chibiShirt && target.shirt) {
        chibiShirt.setAttribute('fill', target.shirt);
      }
      if (chibiItem && target.item) {
        chibiItem.setAttribute('fill', target.item);
      }

      setTimeout(() => {
        chibi.classList.remove('walking');
      }, 850);
    }

    // Gate opening animation
    if (ghnGate) {
      if (target.id >= 3 || target.id === 'gate') {
        ghnGate.classList.add('gate-open');
      } else {
        ghnGate.classList.remove('gate-open');
      }
    }

    // Update details card if it's a numeric milestone
    if (typeof target.id === 'number') {
      renderStopDetails(target.id, event);
    }

    if (statusText) {
      statusText.innerHTML = `📍 Đang ở mốc: <strong>${target.msg}</strong>`;
    }
  }

  // Click on nodes
  nodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      const stopId = parseInt(node.getAttribute('data-stop'), 10);
      const chibiIdx = CHIBI_STOPS.findIndex(s => s.id === stopId);
      if (chibiIdx !== -1) {
        walkChibiTo(chibiIdx, e);
      }
    });
  });

  // Click directly on GHN Gate
  if (ghnGate) {
    ghnGate.addEventListener('click', (e) => {
      e.stopPropagation();
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      const gateIdx = CHIBI_STOPS.findIndex(s => s.id === 'gate');
      if (gateIdx !== -1) {
        walkChibiTo(gateIdx, e);
        showToast('⛩️ <strong>CÁNH CỔNG GHN ĐÃ MỞ!</strong> Chào mừng Thanh Thủy bước vào ngôi nhà áo Cam.');
      }
    });
  }

  // Controller Buttons
  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      let next = currentChibiIndex + 1;
      if (next >= CHIBI_STOPS.length) next = 0;
      walkChibiTo(next, e);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      walkChibiTo(0, e);
    });
  }

  if (btnAuto) {
    btnAuto.addEventListener('click', () => {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      let idx = 0;
      walkChibiTo(0);
      autoTimer = setInterval(() => {
        idx++;
        if (idx < CHIBI_STOPS.length) {
          walkChibiTo(idx);
        } else {
          clearInterval(autoTimer);
          autoTimer = null;
        }
      }, 1600);
    });
  }

  // Initialize at current position
  walkChibiTo(CHIBI_STOPS.length - 1);
}

function triggerAwardConfetti(event) {
  let container = document.getElementById('awardConfettiContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'awardConfettiContainer';
    container.className = 'award-confetti-container';
    document.body.appendChild(container);
  }

  // Calculate burst origin
  const originX = event ? (event.clientX || window.innerWidth / 2) : (window.innerWidth / 2);
  const originY = event ? (event.clientY || window.innerHeight / 2) : (window.innerHeight / 2);

  const colors = ['#f59e0b', '#fbbf24', '#d4f236', '#10b981', '#06b6d4', '#ffffff', '#ffd700'];
  const symbols = ['✦', '★', '🏆', '✨', '🎖️', '•', '◆'];
  const PARTICLE_COUNT = 45;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    
    const isSymbol = Math.random() > 0.45;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    if (isSymbol) {
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.fontSize = Math.floor(Math.random() * 14 + 14) + 'px';
      p.style.color = color;
      p.style.textShadow = `0 0 8px ${color}`;
    } else {
      p.style.width = Math.floor(Math.random() * 8 + 6) + 'px';
      p.style.height = Math.floor(Math.random() * 12 + 6) + 'px';
      p.style.background = color;
      p.style.borderRadius = (Math.random() > 0.5 ? '50%' : '2px');
      p.style.boxShadow = `0 0 10px ${color}`;
    }

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 180 + 70;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity + (Math.random() * 90 + 30); // gravity bias downward
    const rot = (Math.random() - 0.5) * 720;
    const dur = (Math.random() * 0.5 + 0.9).toFixed(2);

    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);
    p.style.setProperty('--rot', `${rot}deg`);
    p.style.setProperty('--dur', `${dur}s`);

    container.appendChild(p);

    setTimeout(() => {
      p.remove();
    }, parseFloat(dur) * 1000 + 100);
  }
}

/* ==========================================================================
   4. CONTROL TOWER LIVE SIMULATOR
   ========================================================================== */
const SCENARIOS = {
  bot_5_moc: {
    terminalLines: [
      { text: '[07:30 - MỐC 1] Điểm danh quân số: 642 bưu tá xuất tuyến tại 86 bưu cục.', type: 'dim' },
      { text: '[10:00 - MỐC 2] Quét tỷ lệ xuất kho: 96.8% đơn hàng đã lên thùng xe đi phát ca 1.', type: 'dim' },
      { text: '[11:50 - MỐC 3] CHỐT CA TRƯA: Quét danh sách 86 bưu cục và 5 kho toàn vùng NTB...', type: 'warn' },
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
      { text: '[08:00 - KAIZEN] Kích hoạt cổng tiếp nhận ảnh check-in vệ sinh kho bãi 86 bưu cục.', type: 'dim' },
      { text: '[AUDIT] Đã nhận 84/86 ảnh. Kiểm tra tiêu chí 5S: Sàn kho, bàn chia chọn, lối thoát hiểm.', type: 'warn' },
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
    '5 Tỉnh Nam Trung Bộ • 19 AMs + 2 SUPs • 86 Bưu cục • 1 KCT + 4 HUB • Tích hợp Trợ lý AI qua Giao thức MCP',
    'Khánh Hòa: %GTC ca sáng đạt 96.4% • Bưu cục Nha Trang giải tỏa 100% đơn tồn',
    'Lâm Đồng: Phát hiện & xử lý 2 đơn COD gối đầu • Kiểm soát an toàn ngân quỹ',
    'Đắk Nông: Thang cứu hộ động kích hoạt thành công • tối ưu năng suất và đạt mốc Target GTC',
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

  playAwardChime() {
    this.init();
    if (!this.ctx || !this.isRadioOn) return;
    try {
      // Golden Victory Arpeggio: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.28, this.ctx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.08 + 0.65);

        osc.connect(gain);
        gain.connect(this.gainMaster);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.65);
      });
    } catch(e) {}
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



/* ==========================================================================
   INTERACTIVE BOT OPERATIONS ECOSYSTEM (ALL 18+ BOTS)
   ========================================================================== */
const ALL_BOTS_DATA = [
  // --- 1. RỦI RO, BẤT ỔN & VOLUME ĐỘT BIẾN ---
  {
    id: "RISK-01",
    mod: "RISK",
    name: "Báo Cáo Danh Sách Bưu Cục Nhóm Bất Ổn & Định Lượng Đơn Clear Thoát Nhóm",
    input: "Master Sheet NTB (Backlog Lastmile, Aging >5N, KTC)",
    output: "Thẻ ảnh HTML Playwright + Telegram / GTalk Vùng",
    freq: "08:00 Sáng hàng ngày",
    insight: "Tự động phân loại 86 bưu cục thành 3 nhóm rõ rệt: 'TOP Bất Ổn', 'Chuẩn Bị Nhảy Nhóm Bất Ổn' và 'Cảnh Báo'. Tính toán chính xác số đơn tối thiểu cần giải phóng trong ngày để trạm thoát khỏi danh sách đen, tag đích danh từng AM phụ trách."
  },
  {
    id: "RISK-02",
    mod: "RISK",
    name: "Bot Cảnh Báo Volume Đột Biến (Sản Lượng Bất Thường Vượt Công Suất Trạm)",
    input: "Dữ liệu nhập hàng theo giờ + Baseline sản lượng trung bình 7 ngày",
    output: "Cảnh báo khẩn cấp GTalk / Telegram Ban Giám Đốc & AM",
    freq: "Quét liên tục mỗi 30 phút",
    insight: "Phát hiện sớm các bưu cục có sản lượng hàng về tăng vọt bất thường (+40% đến +100% so với định biên công suất bưu tá hoặc dồn toa đột ngột từ các Shop lớn). Kích hoạt báo động sớm để Lãnh đạo Vùng và AM kịp thời tăng cường xe tải phụ tuyến hoặc điều động bưu tá hỗ trợ, ngăn chặn nguy cơ vỡ trạm."
  },
  {
    id: "RISK-03",
    mod: "RISK",
    name: "Bot Tự Động Đề Xuất OFF Tuyến Bảo Vệ Trạm (rqoff)",
    input: "Sheet cơ cấu phường xã, sản lượng Shopee 7 ngày",
    output: "Sheet đề xuất OFF tuyến + Telegram Ban Giám Đốc",
    freq: "Kích hoạt khi bưu cục có nguy cơ vỡ trạm",
    insight: "Khi bưu cục chạm ngưỡng quá tải nguy hiểm, bot tự động quét tỷ lệ đơn của từng phường xã để lập danh sách đề xuất tạm dừng nhận đơn TMĐT (OFF tuyến) có chọn lọc, bảo vệ an toàn công suất mà không ảnh hưởng toàn diện đến kinh doanh."
  },

  // --- 2. EXECUTIVE BI & DASHBOARD HỌP HÀNG TUẦN ---
  {
    id: "BI-01",
    mod: "BI",
    name: "Dashboard (DB) Họp Vận Hành Hàng Tuần Trực Quan Cho BGĐ & 19 AMs + 2 SUPs",
    link: "https://namtrungbo.vercel.app/hop",
    input: "Tổng hợp toàn bộ chỉ số KPI Vận hành tuần (SLA %GTC, Backlog, Aging, ODR/OPR, %LTC, COD)",
    output: "Interactive Operations Dashboard trực quan hóa đa chiều (namtrungbo.vercel.app/hop)",
    freq: "Cập nhật tự động trước 07:00 Sáng Thứ Hai hàng tuần",
    insight: "Hệ thống Dashboard điều hành trực quan phục vụ các buổi họp giao ban đầu tuần của Ban Giám đốc Vùng và 19 AMs + 2 SUPs. Trực quan hóa bản đồ nhiệt (Heatmap) 86 bưu cục, 1 KCT, 4 HUB; so sánh tương quan hiệu suất 4 tuần liên tiếp (W39 – Hiện tại); phân tích chuyên sâu %GTC TikTok Shop ca 1, tỷ lệ gán vận hành, tỷ lệ rớt luân chuyển và hỗ trợ lọc linh hoạt theo từng AM và từng tỉnh thành."
  },

  // --- 3. TÀI CHÍNH & KIỂM SOÁT THU TIỀN ---
  {
    id: "FIN-01",
    mod: "FINANCE",
    name: "Cảnh Báo Gối Đầu Tiền Mặt COD & Bắt Quả Tang Fake GPS",
    input: "Dữ liệu COD Lastmile + GPS Geocode",
    output: "Google Sheet tab AM riêng + GTalk Alert",
    freq: "08:30 Sáng hàng ngày",
    insight: "Phát hiện đơn COD >400k hoãn liên tiếp 2 ngày và shipper check-in lệch >2km (ở nhà/quán cafe). Tự động phân luồng sheet riêng cho 19 AMs + 2 SUPs kiểm tra túi hàng trước 11h00, triệt tiêu 95% gian lận chiếm dụng tiền mặt."
  },
  {
    id: "FIN-02",
    mod: "FINANCE",
    name: "Bot Cảnh Báo Bưu Cục Chưa Tick Phiếu Thu Tiền Mặt & Chậm Nộp Quỹ",
    input: "Dữ liệu nộp tiền ngân quỹ & hệ thống phiếu thu bưu cục",
    output: "Cảnh báo GTalk đích danh AM & Kế toán Vùng",
    freq: "Cuối ca trưa (12:00) & Chốt ca tối (20:30)",
    insight: "Tự động rà soát đối soát phiếu thu tiền mặt của 86 bưu cục, phát hiện ngay các bưu cục có tiền thu từ bưu tá nhưng chưa hoàn tất thủ tục tick xác nhận phiếu thu trên hệ thống, triệt tiêu rủi ro tồn đọng công nợ và thất thoát dòng tiền bưu cục."
  },

  // --- 4. NĂNG SUẤT NVPPT & GIAO HÀNG ---
  {
    id: "PROD-01",
    mod: "PROD",
    name: "Bot Đo Lường & Bóc Tách Năng Suất NVPPT (Bưu Tá) N-1 Chi Tiết",
    input: "Dữ liệu đóng ca toàn trình Lastmile N-1",
    output: "Bảng phân tích hiệu suất chi tiết gửi AM & Trưởng Bưu Cục",
    freq: "07:00 Sáng hàng ngày",
    insight: "Phân tích toàn diện hiệu suất của từng Nhân viên phân phát tuyến (NVPPT/bưu tá) trong ngày hôm trước: tỷ lệ hoàn thành %GTC, số đơn giao/giờ, số ca giao lại và lý do hoãn. Xếp hạng Top vượt trội & Bottom cần đào tạo kèm cặp."
  },
  {
    id: "PROD-02",
    mod: "PROD",
    name: "Báo Cáo Năng Suất Giao Hàng Bưu Tá Real-time",
    input: "GHN Lastmile Core API (Token Auth)",
    output: "Thẻ ảnh Card PNG gửi GTalk Vùng",
    freq: "10h00, 11h30, 15h00, 18h00",
    insight: "Giám sát chi tiết sản lượng gán, giao thành công và LTC của từng bưu tá theo thời gian thực, phát hiện ngay nhân sự bị đuối năng suất để AM kịp thời can thiệp ca chiều."
  },
  {
    id: "PROD-03",
    mod: "PROD",
    name: "Đo Lường Gap To Target & Năng Suất N-1 Toàn Vùng",
    input: "API Lastmile + Master Sheet Target",
    output: "Thẻ ảnh Cam/Vàng kim gửi GTalk từng AM",
    freq: "11h30, 15h00, 18h00",
    insight: "Tự động quy đổi tỷ lệ % mục tiêu thành số đơn hàng còn thiếu cụ thể: 'Bưu cục còn thiếu đúng 84 đơn để chạm mốc thưởng GTC', giúp AM điều phối bưu tá tuyến vắng sang cứu tuyến đông."
  },
  {
    id: "PROD-04",
    mod: "PROD",
    name: "Crawl & Cập Nhật Dữ Liệu Năng Suất Vào Sheet Kết Quả",
    input: "GHN Production API",
    output: "Google Sheet Master Kết Quả Vận Hành",
    freq: "07:00 Sáng hàng ngày",
    insight: "Tự động hóa luồng dữ liệu thô từ cổng quản lý sản xuất đổ về Master Sheet, chuẩn hóa cấu trúc báo cáo tự động cho 19 AMs + 2 SUPs mà không cần bất kỳ thao tác copy-paste thủ công nào."
  },
  {
    id: "PROD-05",
    mod: "PROD",
    name: "Đồng Bộ Năng Suất Lịch Sử Đêm Vào Kho Dữ Liệu",
    input: "Lastmile Raw Database",
    output: "Kho dữ liệu phân tích lịch sử",
    freq: "23:00 Hàng đêm",
    insight: "Chốt sổ toàn trình sản lượng và năng suất của 86 bưu cục, ghi nhận dữ liệu phục vụ phân tích xu hướng biến động và tối ưu hóa định biên nhân sự theo mùa vụ."
  },

  // --- 5. KHO TRUNG CHUYỂN (KTC), LẤP ĐẦY THÙNG XE & TỒN KHO ---
  {
    id: "INV-01",
    mod: "INVENTORY",
    name: "Bot Báo Cáo Tỷ Lệ Lấp Đầy Thùng Xe KTC (Truck Fill Rate)",
    input: "Thể tích CBM & Khối lượng kg thực tế của lô hàng + Định mức thùng xe tải",
    output: "Thẻ ảnh trực quan đo lường Fill Rate gửi Kênh Điều Phối Vận Tải & HUB",
    freq: "Từng chuyến xe xuất bến tại 4 HUB KTC (07:00, 11:30, 14:00, 19:30)",
    insight: "Đo lường và giám sát tự động tỷ lệ lấp đầy thể tích (CBM) và tải trọng của các chuyến xe tải luân chuyển xuất phát từ 4 HUB Kho Trung Chuyển và 1 Kho Chuyển Tiếp. Phát hiện ngay các chuyến xe 'chạy rỗng' (<65% tải) để điều phối ghép tuyến kịp thời và cảnh báo xe quá tải, tối ưu hóa 15% chi phí nhiên liệu và khấu hao xe."
  },
  {
    id: "INV-02",
    mod: "INVENTORY",
    name: "Báo Cáo Backlog KTC & Giám Sát Luồng Hàng Xuất - Nhập 4 HUB Trung Chuyển",
    input: "Dữ liệu Inbound/Outbound Scanning tại 4 HUB KTC + 1 KCT",
    output: "Bảng cân đối Xuất - Nhập - Tồn realtime gửi GTalk Ban Giám Đốc & Điều Hành Vùng",
    freq: "06:00, 12:00, 18:00 & 22:00 Hàng ngày",
    insight: "Bóc tách chi tiết lượng hàng nhập trạm, hàng đã chia chọn xuất tải và lượng hàng Backlog tồn đọng tại 4 Kho Trung Chuyển (Khánh Hòa, Bình Thuận, Đức Trọng, Đắk Nông) cùng 1 Kho Chuyển Tiếp. Nhận diện nút thắt cổ chai chia chọn dồn ứ trước khi ảnh hưởng dây chuyền đến các bưu cục Lastmile."
  },
  {
    id: "INV-03",
    mod: "INVENTORY",
    name: "Bot Cảnh Báo Bưu Cục Chưa Bắn Kiểm Tải Hàng & Luân Chuyển Đến",
    input: "Manifest điều xe tải từ 4 HUB trung chuyển + Dữ liệu Inbound Scanning",
    output: "Ping khẩn cấp GTalk Kênh Điều Phối & Trưởng Bưu Cục",
    freq: "Các mốc xe tải hạ hàng (06:30, 08:30, 13:30)",
    insight: "Tự động rà soát lịch trình xe tải đến trạm đối chiếu với trạng thái quét mã kiện. Cảnh báo ngay lập tức nếu bưu cục đã tiếp nhận xe tải nhưng chưa bắn kiểm nhập kho sau 30 phút, ngăn chặn tình trạng 'ngâm tải' khiến đơn không kịp xuất tuyến giao trong ngày."
  },
  {
    id: "INV-04",
    mod: "INVENTORY",
    name: "Push Đơn Tồn Kho: Aging Lưu Bãi Quá Hạn (>3N, >5N, >8N, >10N)",
    input: "GHN Aging API (Token) + Snapshot JSON",
    output: "Google Sheet Master + Bảng màu GTalk",
    freq: "08:30 & 14:00",
    insight: "Bóc tách hàng nghìn mã đơn tồn bãi theo từng dải tuổi hàng, tự động định dạng bảng màu cảnh báo đỏ/vàng trên GTalk, ép tỷ lệ xuất kho xử lý đơn trễ và giảm thiểu tối đa bồi thường thất lạc."
  },
  {
    id: "INV-05",
    mod: "INVENTORY",
    name: "Giám Sát Tỷ Lệ Gán Đơn Tồn (Assignment Rate) Của 19 AM + 2 SUP",
    input: "Aging Snapshot JSON Cache",
    output: "BXH công khai nhóm GTalk Lãnh Đạo Vùng",
    freq: "Cuối ngày",
    insight: "Theo dõi tỷ lệ gán đơn tồn bãi của từng AM ra tuyến bưu tá. Công khai bảng xếp hạng tỷ lệ giải phóng hàng tồn, tạo áp lực minh bạch để các quản lý khu vực tập trung giải tỏa đơn khó."
  },
  {
    id: "INV-06",
    mod: "INVENTORY",
    name: "Phân Tích Cơ Cấu & Kẹt Xe Tải Luân Chuyển Liên Tỉnh (LTC)",
    input: "GHN Luân Chuyển API",
    output: "Bảng màu HTML GTalk Điều Phối",
    freq: "07:30 & 13:30",
    insight: "Đo lường chi tiết sản lượng hàng luân chuyển qua 4 Kho Trung Chuyển (HUB) và 1 Kho Chuyển Tiếp (KCT), phát hiện các xe tải liên tỉnh bị chậm cut-off để điều tiết tải trọng kịp thời."
  },
  {
    id: "INV-07",
    mod: "INVENTORY",
    name: "Push Đơn Pending Lấy Của Shop Trễ Cam Kết SLA",
    input: "First-mile Pickup Core Data",
    output: "GTalk Kênh Điều Phối Lấy Hàng",
    freq: "Đầu ca sáng & chiều",
    insight: "Quét toàn bộ yêu cầu lấy hàng từ người gửi (Shop/Merchant), cảnh báo sớm các đơn sắp vượt ngưỡng cam kết SLA lấy hàng để bưu tá ưu tiên lấy trước, bảo vệ chỉ số hài lòng khách hàng."
  },

  // --- 6. SÀN THƯƠNG MẠI ĐIỆN TỬ ---
  {
    id: "ECOMM-01",
    mod: "ECOMM",
    name: "Cảnh Báo Quá Hạn Sàn Shopee & TikTok Shop (ODR/OPR)",
    input: "Looker BI Web Portal (Crawl tự động bằng Playwright)",
    output: "GTalk Vùng NTB + File CSV phân tích",
    freq: "07:30 & 14:00",
    insight: "Bảo vệ tỷ lệ cam kết bàn giao đơn hàng sàn TMĐT không vượt quá ngưỡng phạt. Tự động bóc tách các mã vận đơn có nguy cơ fail SLA sàn và gửi cảnh báo sớm về các bưu cục trọng điểm."
  },
  {
    id: "ECOMM-02",
    mod: "ECOMM",
    name: "Báo Cáo & Nhắc Nhở AM Mua Đơn TikTok Shop (TTS 35k)",
    input: "TTS Performance Database",
    output: "Thẻ ảnh Card PNG + Nhắc nhở đích danh AM",
    freq: "11:00 & 16:30",
    insight: "Theo dõi chỉ số mua đơn TikTok Shop ưu đãi 35k, tự động tổng hợp số lượng AM đã kích hoạt và gửi thẻ ảnh nhắc nhở đích danh các quản lý khu vực chưa đạt tiến độ cam kết."
  },

  // --- 7. NHÂN SỰ & KỶ LUẬT 5S KAIZEN ---
  {
    id: "HR-01",
    mod: "HR",
    name: "Bot Điểm Danh & Chấm Phạt Cut-off 5 Mốc (Lưu Trữ SQLite)",
    input: "Tin nhắn AM báo cáo + SQLite diem_danh.db",
    output: "Chatbot tương tác + Sheet 'Theo Dõi Phạt AM'",
    freq: "5 Mốc: 08h, 10h, 11h, 16h, 20h",
    insight: "Chuẩn hóa kỷ luật báo cáo của 19 AMs + 2 SUPs. Đếm ngược trước 15 phút, ghi nhận thời gian nộp chính xác đến từng giây vào cơ sở dữ liệu SQLite và tự động tính tiền phạt vi phạm công bằng, không cảm tính."
  },
  {
    id: "HR-02",
    mod: "HR",
    name: "Bot Check-in Định Vị GPS Thực Địa Cho HRBP & SUP",
    input: "Telegram Live Location + Biểu mẫu kiểm tra",
    output: "Google Sheet Nhật Ký Công Tác Vùng",
    freq: "Realtime theo lịch công tác thực tế",
    insight: "Giám sát lịch trình công tác thực địa của đội ngũ HRBP và Giám sát bưu cục. Bắt buộc chia sẻ vị trí trực tiếp để xác thực việc nhân sự có mặt tại trạm kiểm tra và tự động cập nhật nhật ký công tác vùng."
  },
  {
    id: "HR-03",
    mod: "HR",
    name: "Bot Giám Sát Chuẩn Hóa Kỷ Luật 5S Kaizen Bưu Cục",
    input: "Hình ảnh hiện trường check-in từ 86 bưu cục và các kho",
    output: "Telegram Group Kaizen 5 Tỉnh",
    freq: "08:00 Sáng hàng ngày",
    insight: "Bắt buộc bưu cục chụp ảnh layout kho bãi, lối thoát hiểm và phân khu hàng cồng kềnh (>10kg), tự động chấm điểm và cảnh báo các trạm bừa bộn vi phạm an toàn."
  },
  {
    id: "HR-04",
    mod: "HR",
    name: "Bot Cảnh Báo & Phân Luồng Ticket Khiếu Nại Realtime",
    input: "Tin nhắn báo ticket từ kênh tập trung",
    output: "Tự động bắn vào 5 Nhóm Kaizen Tỉnh",
    freq: "Realtime trong < 30 giây",
    insight: "Tiếp nhận các ticket khiếu nại chất lượng dịch vụ, tự động bóc tách từ khóa phân loại theo từng tỉnh và chuyển tiếp ngay lập tức đến nhóm xử lý liên quan để tháo gỡ sự cố trong 15 phút."
  }
];

function initBotEcosystemMatrix() {
  const grid = document.getElementById('botCardsGrid');
  const pills = document.querySelectorAll('#bmFilterPills .bm-pill');
  if (!grid || !pills.length) return;

  function renderBots(filterMod) {
    grid.innerHTML = '';
    const filtered = (filterMod === 'ALL') 
      ? ALL_BOTS_DATA 
      : ALL_BOTS_DATA.filter(b => b.mod === filterMod);

    filtered.forEach(bot => {
      const card = document.createElement('div');
      card.className = 'bot-card-item';
      card.innerHTML = `
        <div>
          <div class="bc-top">
            <span class="bc-id">${bot.id}</span>
            <span class="bc-status">
              <span class="bc-status-dot"></span>
              LIVE PIPELINE
            </span>
          </div>
          <h4 class="bc-name">${bot.name}</h4>
          
          <p class="bc-insight">${bot.insight}</p>
          ${bot.link ? `<div style="margin-top: 10px; margin-bottom: 6px;"><a href="${bot.link}" target="_blank" rel="noopener noreferrer" class="bc-link-pill">📊 Mở Trực Tiếp Dashboard Họp Tuần ↗</a></div>` : ''}
        </div>
        <div class="bc-meta-row">
          <div>
            <span class="bc-meta-label">Đầu vào / Input:</span>
            <span class="bc-meta-val">${bot.input}</span>
          </div>
          <div>
            <span class="bc-meta-label">Đầu ra / Kênh:</span>
            <span class="bc-meta-val">${bot.output}</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const mod = pill.getAttribute('data-mod');
      renderBots(mod);
    });
  });

  // Initial render all
  renderBots('ALL');
}


/* ==========================================================================
   IN-PLACE LIVE MV SYNTH-POP PLAYER & REAL-TIME KARAOKE LYRICS ENGINE
   ========================================================================== */
const SYNCHRONIZED_LYRICS = [
  { time: 0, text: "🎶 [Intro] Midnight on the terminal screen...", next: "Signal's turning emerald green..." },
  { time: 6, text: "Signal's turning emerald green.", next: "From the coast to the highland crest..." },
  { time: 11, text: "From the coast to the highland crest, never stop, never settle for less...", next: "Started at the frontline, picking up the call..." },
  { time: 19, text: "Started at the frontline, picking up the call,", next: "Every single parcel, watching where they fall..." },
  { time: 25, text: "Every single parcel, watching where they fall.", next: "Turned the friction into code, turned the panic into speed..." },
  { time: 31, text: "Turned the friction into code, turned the panic into speed,", next: "Building up the systems for everything they need..." },
  { time: 38, text: "Building up the systems for everything they need.", next: "Shopee in the fast lane, Tiki on the dash..." },
  { time: 44, text: "Shopee in the fast lane, Tiki on the dash,", next: "Lazada rolling through the flash!" },
  { time: 48, text: "Lazada rolling through the flash!", next: "Lines of Python burning bright..." },
  { time: 54, text: "Lines of Python burning bright, guiding all the trucks tonight.", next: "We don't wait for things to break..." },
  { time: 61, text: "We don't wait for things to break, we rewrite the moves they make!", next: "🔥 MAKE DATA MOVE! (Hey!)" },
  { time: 67, text: "🔥 MAKE DATA MOVE! (Hey!)", next: "Hear the rhythm on the highway roar..." },
  { time: 72, text: "Hear the rhythm on the highway roar, five provinces running strong and pure!", next: "From the ocean breeze to the mountain peaks..." },
  { time: 79, text: "From the ocean breeze to the mountain peaks, we are the pulse that the city seeks!", next: "MAKE OPS FLAWLESS, BREAK THE GROOVE!" },
  { time: 87, text: "MAKE OPS FLAWLESS, BREAK THE GROOVE! MAKE DATA MOVE!", next: "Twenty-twenty-five came with the gold in hand..." },
  { time: 96, text: "Twenty-twenty-five came with the gold in hand,", next: "Best of the best, standing where I stand..." },
  { time: 102, text: "Best of the best, standing where I stand.", next: "Eighty-five stations locked in sync..." },
  { time: 108, text: "Eighty-five stations locked in sync, fixing every bottleneck in the time you blink.", next: "Calculate the target, clear the line..." },
  { time: 116, text: "Calculate the target, clear the line, everything arriving right on time!", next: "🔥 MAKE DATA MOVE! (Hey!)" },
  { time: 124, text: "🔥 MAKE DATA MOVE! (Hey!)", next: "Hear the rhythm on the highway roar..." },
  { time: 130, text: "Hear the rhythm on the highway roar, five provinces running strong and pure!", next: "From the ocean breeze to the mountain peaks..." },
  { time: 138, text: "From the ocean breeze to the mountain peaks, we are the pulse that the city seeks!", next: "MAKE OPS FLAWLESS, BREAK THE GROOVE!" },
  { time: 146, text: "MAKE OPS FLAWLESS, BREAK THE GROOVE! MAKE DATA MOVE!", next: "No more noise, no more doubt..." },
  { time: 156, text: "No more noise, no more doubt, that's what data's all about!", next: "Five provinces, one command..." },
  { time: 165, text: "Five provinces, one command... The fastest pulse across the land.", next: "Make data move... Make ops flawless..." },
  { time: 175, text: "Make data move... Make ops flawless. ✨", next: "GHN Nam Trung Bộ — 2026" }
];

function initLiveInPlacePlayer() {
  const stage = document.getElementById('mvDeliveryStage');
  const parcelWrapper = document.getElementById('ghnParcelWrapper');
  const btnUnbox = document.getElementById('btnUnboxParcel');
  const card = document.getElementById('mvLiveCard');
  const btnRepack = document.getElementById('btnRepackBox');

  const btnPlay = document.getElementById('btnMvPlayToggle');
  const playSvg = document.getElementById('mvPlaySvg');
  const lyricCurrent = document.getElementById('mvLyricCurrent');
  const lyricNext = document.getElementById('mvLyricNext');
  const progressFill = document.getElementById('mvProgressFill');
  const progressTrack = document.getElementById('mvProgressTrack');
  const timeCurrent = document.getElementById('mvTimeCurrent');
  const timeDuration = document.getElementById('mvTimeDuration');
  const btnToggleLyrics = document.getElementById('btnToggleFullLyrics');
  const lyricsDrawer = document.getElementById('mvLyricsDrawer');
  const btnCloseDrawer = document.getElementById('btnCloseDrawer');

  if (!card) return;

  // Real Master Vocal Audio Element from Suno
  const audio = new Audio('assets/theme_song.m4a?v=vocal1');
  audio.preload = 'auto';

  let isPlaying = false;
  let audioCtx = null;
  let analyser = null;
  let animFrameId = null;

  function initVisualizer() {
    if (audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
      const source = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch(e) {
      console.log('Visualizer setup error:', e);
    }
  }

  function formatTime(sec) {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  audio.addEventListener('loadedmetadata', () => {
    if (timeDuration && audio.duration) {
      timeDuration.textContent = formatTime(audio.duration);
    }
  });

  function updateVisualizerBars() {
    const eqBars = document.querySelectorAll('#mvMiniEq .eq-bar');
    if (analyser && isPlaying && eqBars.length > 0) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      eqBars.forEach((bar, idx) => {
        const val = dataArray[idx * 3] || 100;
        const h = Math.max(3, Math.min(16, (val / 255) * 16));
        bar.style.height = `${h}px`;
      });
      animFrameId = requestAnimationFrame(updateVisualizerBars);
    }
  }

  audio.addEventListener('timeupdate', () => {
    const cur = audio.currentTime;
    const dur = audio.duration || 196;
    if (timeCurrent) timeCurrent.textContent = formatTime(cur);
    if (progressFill) progressFill.style.width = `${Math.min(100, (cur / dur) * 100)}%`;

    // Real-time Karaoke Subtitles
    for (let i = SYNCHRONIZED_LYRICS.length - 1; i >= 0; i--) {
      if (cur >= SYNCHRONIZED_LYRICS[i].time) {
        if (lyricCurrent && lyricCurrent.textContent !== SYNCHRONIZED_LYRICS[i].text) {
          lyricCurrent.textContent = SYNCHRONIZED_LYRICS[i].text;
          if (lyricNext) lyricNext.textContent = SYNCHRONIZED_LYRICS[i].next || '';
        }
        break;
      }
    }
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    card.classList.remove('playing');
    if (playSvg) playSvg.innerHTML = '<path d="M8 5v14l11-7z"/>';
    if (lyricCurrent) lyricCurrent.textContent = '▶ Bấm Play để nghe lại từ đầu...';
    if (progressFill) progressFill.style.width = '0%';
    document.querySelectorAll('#mvMiniEq .eq-bar').forEach(b => b.style.height = '4px');
    if (animFrameId) cancelAnimationFrame(animFrameId);
  });

  function startPlayback() {
    initVisualizer();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    audio.play().catch(e => console.log('Audio playback error:', e));
    isPlaying = true;
    card.classList.add('playing');
    if (playSvg) {
      playSvg.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/>';
    }
    updateVisualizerBars();
    showToast('🎤 <strong>ĐANG PHÁT BÀI HÁT GỐC (FULL VOCALS):</strong> MAKE DATA MOVE');
  }

  function stopPlayback() {
    audio.pause();
    isPlaying = false;
    card.classList.remove('playing');
    if (playSvg) {
      playSvg.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    document.querySelectorAll('#mvMiniEq .eq-bar').forEach(b => b.style.height = '4px');
  }

  function togglePlay() {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }

  if (btnPlay) {
    btnPlay.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  // Scrubbing on progress bar
  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = progressTrack.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (audio.duration) {
        audio.currentTime = clickRatio * audio.duration;
      }
    });
  }

  // Unboxing & Repacking Controller
  function triggerUnboxing() {
    if (!stage || !card || !parcelWrapper) return;
    stage.classList.add('unboxing-active');

    setTimeout(() => {
      parcelWrapper.style.display = 'none';
      card.style.display = 'block';
      stage.classList.remove('unboxing-active');
      stage.classList.remove('stage-parcel');
      stage.classList.add('stage-mv');
      startPlayback();
      showToast('🎁 <strong>ĐÃ MỞ KIỆN HÀNG THÀNH CÔNG!</strong> Đang phát bài hát có giọng hát ca sĩ AI.');
    }, 450);
  }

  function repackBox() {
    if (!stage || !card || !parcelWrapper) return;
    stopPlayback();
    card.style.display = 'none';
    parcelWrapper.style.display = 'block';
    stage.classList.remove('stage-mv');
    stage.classList.add('stage-parcel');
    audio.currentTime = 0;
    if (progressFill) progressFill.style.width = '0%';
    if (lyricCurrent) lyricCurrent.textContent = '▶ Bấm Play để nghe nhạc & chạy lời...';
    showToast('📦 Đã đóng gói lại kiện hàng. Bạn có thể khui hộp lại bất cứ lúc nào!');
  }

  if (btnUnbox) {
    btnUnbox.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerUnboxing();
    });
  }

  if (parcelWrapper) {
    parcelWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerUnboxing();
    });
  }

  if (btnRepack) {
    btnRepack.addEventListener('click', (e) => {
      e.stopPropagation();
      repackBox();
    });
  }

  // Toggle full lyrics accordion drawer
  if (btnToggleLyrics && lyricsDrawer) {
    btnToggleLyrics.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = lyricsDrawer.hidden;
      lyricsDrawer.hidden = !isHidden;
      btnToggleLyrics.setAttribute('aria-expanded', String(isHidden));
      btnToggleLyrics.innerHTML = isHidden ? '<span>Thu gọn lời ✕</span>' : '<span>📜 Xem toàn bộ lời</span>';
    });
  }

  if (btnCloseDrawer && lyricsDrawer && btnToggleLyrics) {
    btnCloseDrawer.addEventListener('click', (e) => {
      e.stopPropagation();
      lyricsDrawer.hidden = true;
      btnToggleLyrics.setAttribute('aria-expanded', 'false');
      btnToggleLyrics.innerHTML = '<span>📜 Xem toàn bộ lời</span>';
    });
  }

  // Expose global debug controller
  window.mvPlayer = {
    unbox: triggerUnboxing,
    repack: repackBox,
    play: startPlayback,
    pause: stopPlayback,
    toggle: togglePlay,
    seek: (sec) => {
      audio.currentTime = sec;
    },
    getCurrentTime: () => audio.currentTime,
    isPlaying: () => isPlaying,
    audioElement: audio
  };
}
