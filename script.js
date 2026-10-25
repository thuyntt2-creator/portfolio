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
    id: 'NTB-COD-01',
    badge: 'CASE 01 · FINANCIAL RISK · FRAUD DETECTION',
    title: 'Bóc Tách Gối Đầu COD & Bắt Quả Tang Gian Lận Fake GPS',
    role: 'Kiểm Soát Rủi Ro Tài Chính & Dòng Tiền · Python, GPS Haversine, Google Sheets API, GTalk Bot',
    desc: 'Thuật toán bóc tách giao thoa 3 điều kiện: Đơn có tiền thu hộ COD > 400.000 VNĐ bị hoãn hẹn liên tiếp từ 2 ngày, kết hợp độ lệch tọa độ check-in GPS bưu tá > 2.000m so với địa chỉ khách hàng. Hệ thống tự động phân tách tab riêng cho 27 AMs và bắn cảnh báo đích danh yêu cầu kiểm tra túi hàng bưu tá trước 11h00 trưa.',
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
        <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-dim);">File: tao_file_canh_bao_cod.py</span>
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
        <span style="color:var(--accent-emerald);">✓ Phân luồng Tab Sheet riêng cho 27 AMs</span>
        <span style="color:var(--accent-lime); font-family:var(--font-mono);">Ping GTalk: 08:30 sáng</span>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Tại địa bàn 5 tỉnh Nam Trung Bộ với hơn 85 bưu cục và hàng trăm bưu tá, công nợ tiền mặt COD luôn là rủi ro tài chính sống còn. Nhiều bưu tá thu tiền mặt COD từ người nhận nhưng không nộp về tài khoản bưu cục đúng hạn, tự ý cập nhật trạng thái "Khách hoãn / Hẹn giao lại" để chiếm dụng tiền mặt tiêu xài cá nhân hoặc lấy tiền thu của đơn sau đắp bù đơn trước (gối đầu).
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
          Script <code>tao_file_canh_bao_cod.py</code> tự động phân tách danh sách mã vận đơn vi phạm theo từng tab Google Sheet riêng của 27 Quản lý khu vực (AM). Đúng 08:30 sáng, bot <code>gui_canh_bao_goidau_cod.py</code> bắn tin nhắn đích danh kèm link sheet vào nhóm kín của AM, yêu cầu AM <strong>xuống kiểm tra thực tế thùng xe và túi hàng của bưu tá trước 11h00 trưa</strong>.
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
          <code>tao_file_canh_bao_cod.py</code> (ETL & bóc tách logic) • <code>gui_canh_bao_goidau_cod.py</code> (Google Chat API & gspread) • <code>Bao_Cao_Canh_Bao_Goi_Dau_COD_*.xlsx</code> • Tự động chạy lịch trình qua Windows Task Scheduler / .bat.
        </p>
      </div>
    `
  },

  2: {
    id: 'NTB-GTC-02',
    badge: 'CASE 02 · REVENUE STAIRCASE · GTC BOOST',
    title: 'Dynamic Target Staircase & Giải Cứu 14 Bưu Cục Đáy',
    role: 'Chiến Lược Quản Trị Mục Tiêu GTC · Python, Headless Playwright, Jinja2 Thẻ Ảnh PNG, Google Chat',
    desc: 'Thuật toán Bậc Thang Động (Dynamic Staircase): Tự động nhận diện bưu cục yếu kém (GTC < 55%) để kích hoạt thang cứu hộ thấp [40% - 60%], tự nâng bậc [60% - 80%] khi vượt ngưỡng. Đặc biệt quy đổi tỷ lệ % thành "Số Lượng Đơn Hàng Còn Thiếu (Gap to Target)" theo từng khung giờ then chốt.',
    metrics: [
      { val: '+4% – 6% GTC', lbl: 'Tăng trưởng 14 bưu cục cảnh báo' },
      { val: '14 Bưu Cục', lbl: 'Giải cứu thành công bưu cục đáy' },
      { val: '11:30 · 15:00 · 18:00', lbl: 'Render thẻ ảnh Gap-to-Target theo giờ' }
    ],
    tech: ['Python 3.11', 'Playwright Headless', 'Jinja2 HTML Cards', 'Pillow Image Generation', 'Google Chat API', 'Dynamic Staircase Logic'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-emerald); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#10b981; border-radius:50%; box-shadow:0 0 8px #10b981;"></span>
          THUẬT TOÁN TARGET BẬC THANG ĐỘNG (GTC)
        </span>
        <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-dim);">File: report_target_gtalk.py</span>
      </div>
      <div style="background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.25); border-radius:8px; padding:12px; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--text-main);">Hub Phan Rang (Ninh Thuận)</span>
          <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--accent-amber); background:rgba(245,158,11,0.15); padding:2px 6px; border-radius:4px;">GTC Hiện Tại: 51.8%</span>
        </div>
        <div style="background:rgba(0,0,0,0.3); border-radius:6px; padding:8px; font-size:0.73rem; line-height:1.5;">
          <div style="color:var(--accent-cyan); font-weight:600; margin-bottom:3px;">🎯 THANG CỨU HỘ ĐỘNG ĐANG KÍCH HOẠT: [40% → 45% → 50% → 55% → 60%]</div>
          <div style="color:var(--text-muted);">Quy đổi mốc 15h00: <strong style="color:var(--accent-lime);">CÒN THIẾU ĐÚNG 84 ĐƠN</strong> để đạt ngưỡng thưởng 60%!</div>
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
          Tỷ lệ Giao Thành Công (GTC) toàn vùng Nam Trung Bộ thường xuyên bị kéo tụt bởi nhóm "14 bưu cục đáy" (chủ yếu ở vùng núi hiểm trở Lâm Đồng, Đắk Nông hoặc bưu cục thiếu nhân sự). Trước đây, Ban Giám đốc chỉ gửi một chỉ tiêu % cứng nhắc (ví dụ: yêu cầu toàn vùng đạt 85%).
        </p>
        <p class="m-text" style="margin-top:8px;">
          Khi nhìn thấy con số 85% quá xa vời so với thực tế (đang ở mức 45-50%), AM và bưu tá rơi vào tâm lý buông xuôi, bất cần vì biết chắc chắn không thể chạm tới.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán & Insight bóc tách dữ liệu</h4>
        <p class="m-text">Thủy thiết kế thuật toán <strong>Dynamic Target Staircase (Bậc Thang Động)</strong>:</p>
        <ul class="m-list">
          <li><strong>Phân nhánh theo sức khỏe bưu cục:</strong> Nếu GTC ngày N-1 &lt; 55%, bot tự động kích hoạt thang cứu hộ thấp gồm các nấc [40%, 45%, 50%, 55%, 60%] để tạo động lực từng bước. Khi bưu cục đã vượt 55%, bot tự nâng lên thang bứt phá [60%, 70%, 80%].</li>
          <li><strong>Quy đổi Gap-to-Target ra số lượng đơn:</strong> Thay vì con số % trừu tượng, bot tính toán: <em>Số đơn cần giao thêm = (Target% * Tổng đơn ca) - Số đơn đã giao</em>, cập nhật liên tục theo các khung giờ vàng 11h30, 15h00 và 18h00.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🎯 Quyết định & Hành động can thiệp (Actionable Decision)</h4>
        <p class="m-text">
          AM nhận được thẻ ảnh thông số chính xác: <em>"Hub Phan Rang còn thiếu đúng 84 đơn để chạm mốc thưởng 60%"</em>. Thay vì quát tháo chung chung, AM lập tức điều động 3 bưu tá thuộc tuyến hàng vắng sang tiếp ứng các tuyến đông để dứt điểm ngay trong buổi chiều trước giờ chốt sổ.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Tăng từ 4% – 6% GTC</strong> cho toàn bộ nhóm 14 bưu cục cảnh báo chỉ sau 2 tuần triển khai chiến dịch cứu hộ.</li>
          <li>Trực tiếp đưa tỷ lệ GTC toàn vùng Nam Trung Bộ vươn lên nhóm dẫn đầu toàn hệ thống GHN cả nước.</li>
          <li>Tạo động lực tinh thần cho đội ngũ giao hàng tuyến đầu, biến mục tiêu bất khả thi thành các mốc khả thi trong tầm tay.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          <code>report_target_gtalk.py</code> • <code>send_realtime_and_target_gtalk.py</code> • <code>send_gtalk_report.py</code> • Render thẻ ảnh card HTML/CSS bằng Playwright Headless & Pillow (<code>01_Realtime_Target_GTC_Card.png</code>).
        </p>
      </div>
    `
  },

  3: {
    id: 'NTB-AGING-03',
    badge: 'CASE 03 · INVENTORY CONTROL · CLAIMS REDUCTION',
    title: 'Bóc Tách Aging Cột O & Giám Sát Tỷ Lệ Gán Đơn Tồn AM',
    role: 'Tối Ưu Hóa Kho Bãi & Cắt Giảm Chi Phí Bồi Thường Hàng Hóa · Python Pandas, JSON Snapshots, Table Generator',
    desc: 'Phân tầng dữ liệu tồn kho lưu bãi theo dải ngày (>3N, >5N, >8N, >10N). Xây dựng công thức đo lường "Tỷ Lệ Gán Đơn Tồn (Assignment Rate)" của từng AM và xếp hạng công khai trên GTalk lãnh đạo Vùng, triệt tiêu tâm lý né tránh đơn khó và ngăn ngừa hàng nghìn đơn rơi vào tình trạng đền bù.',
    metrics: [
      { val: '-65% Đơn >8N', lbl: 'Giảm mạnh hàng tồn siêu trễ' },
      { val: 'Hàng Trăm Triệu', lbl: 'Tiết kiệm chi phí đền bù hư hỏng / tháng' },
      { val: '70% Cut-off', lbl: 'Ngưỡng cảnh báo kỷ luật Assignment Rate' }
    ],
    tech: ['Python 3.11', 'Pandas Analytics', 'JSON Delta Snapshots', 'Automated Table Coloring', 'Google Chat Broadcast', 'Windows .bat Automation'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-amber); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#f59e0b; border-radius:50%; box-shadow:0 0 8px #f59e0b;"></span>
          PHÂN TẦNG TỒN KHO AGING & ASSIGNMENT RATE AM
        </span>
        <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-dim);">File: ntb_aging_report_col_o.py</span>
      </div>
      <div style="background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.25); border-radius:8px; padding:10px; margin-bottom:10px;">
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; text-align:center; margin-bottom:8px;">
          <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:4px;"><div style="color:var(--text-main); font-weight:700;">&gt;3 Ngày</div><div style="font-size:0.65rem; color:#888;">Theo dõi</div></div>
          <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:4px;"><div style="color:var(--accent-amber); font-weight:700;">&gt;5 Ngày</div><div style="font-size:0.65rem; color:#888;">Cảnh báo</div></div>
          <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:4px;"><div style="color:var(--accent-rose); font-weight:700;">&gt;8 Ngày</div><div style="font-size:0.65rem; color:#888;">Rủi ro đền bù</div></div>
          <div style="background:rgba(0,0,0,0.3); padding:6px; border-radius:4px;"><div style="color:#c084fc; font-weight:700;">&gt;10 Ngày</div><div style="font-size:0.65rem; color:#888;">Báo động đỏ</div></div>
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
          Hàng lưu kho quá hạn (Aging) là "cơn ác mộng" của bất kỳ doanh nghiệp chuyển phát nhanh nào. Hàng tồn từ 1-3 ngày là biến động tự nhiên, nhưng khi hàng nằm kho từ 8 đến 10 ngày trở lên, tỷ lệ người mua từ chối nhận hàng hoặc hàng hóa bị móp méo, hư hỏng trong quá trình bảo quản tăng vọt lên tới 70%.
        </p>
        <p class="m-text" style="margin-top:8px;">
          Khi đó GHN phải chịu toàn bộ chi phí bồi hoàn giá trị đơn hàng. Cấp quản lý bưu cục (AM) thường có tâm lý né tránh, ngại phân công bưu tá đi giao những kiện hàng khó này, khiến hàng ngày càng tồn lâu hơn.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán & Insight bóc tách dữ liệu</h4>
        <p class="m-text">Thủy xây dựng hệ thống bóc tách dữ liệu tồn kho từ Cột O theo các dải ngày:</p>
        <ul class="m-list">
          <li><strong>Phân tầng dải ngày:</strong> Tự động bóc tách và phân loại hàng tồn theo 4 dải nguy hiểm: &gt;3N, &gt;5N, &gt;8N và &gt;10N.</li>
          <li><strong>Định nghĩa chỉ số Assignment Rate:</strong> Thiết lập công thức đo lường mức độ quyết liệt của từng AM: <code>Assignment Rate = (Số đơn tồn đã được phân công bưu tá đi phát) / (Tổng số đơn tồn hiện hữu trong kho)</code>.</li>
          <li><strong>So sánh ảnh chụp nhanh (Delta Snapshots):</strong> Lưu trữ trạng thái vào file JSON snapshot để phát hiện trường hợp AM chỉ bấm gán đơn đối phó trên hệ thống rồi sau đó lại thu hồi về kho.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🎯 Quyết định & Hành động can thiệp (Actionable Decision)</h4>
        <p class="m-text">
          Hệ thống tự động render bảng phân tích màu sắc và xếp hạng công khai mức độ giải quyết hàng tồn của 27 AMs lên nhóm GTalk lãnh đạo Vùng. AM nào có tỷ lệ gán đơn &lt; 70% phải giải trình trực tiếp với Giám đốc Vùng lý do tại sao để đơn hàng nằm im trong kho mà không cho bưu tá xuất phát.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Cắt giảm 65%</strong> lượng đơn tồn kho siêu trễ (&gt;8 ngày) trên toàn địa bàn 5 tỉnh Nam Trung Bộ.</li>
          <li><strong>Tiết kiệm hàng trăm triệu đồng</strong> chi phí đền bù hàng hóa hỏng/vỡ mỗi tháng cho công ty.</li>
          <li>Giải phóng diện tích kho bãi tại 85 bưu cục, nâng cao tốc độ quay vòng của luồng hàng hóa.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          <code>ntb_aging_report_col_o.py</code> • <code>ntb_aging_dachien.py</code> • <code>analyze_am_aging_assignment_rate.py</code> • <code>snapshot_aging.json</code> • Bảng màu tự động (<code>table_aging_color.png</code>, <code>table_am_aging_analysis_dachien.png</code>).
        </p>
      </div>
    `
  },

  4: {
    id: 'NTB-ATTEND-04',
    badge: 'CASE 04 · OPERATIONS DISCIPLINE · SQLITE ENGINE',
    title: 'Bot Điểm Danh & Chấm Phạt Cut-off 5 Mốc Giờ Vàng',
    role: 'Kỷ Luật Thép Vận Hành · SQLite Database, Python Automation, GSpread Sync, Automated Penalty Engine',
    desc: 'Chuẩn hóa 5 mốc cut-off chiến lược trong ngày (08:00, 10:00, 11:00, 16:00, 20:00) cho 85 bưu cục. Tích hợp cơ sở dữ liệu SQLite (diem_danh.db) ghi nhận chính xác thời gian báo cáo đến từng giây, đếm ngược nhắc giờ trước 15 phút và tự động chấm phạt vi phạm minh bạch tuyệt đối.',
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
          <li><strong>Tỷ lệ nộp báo cáo đúng hạn tăng vọt từ 65% lên 98.2%</strong> trên toàn bộ 85 bưu cục.</li>
          <li>Xóa bỏ 100% tình trạng "mù thông tin" của Ban Giám đốc trong các khung giờ điều hành then chốt.</li>
          <li>Thiết lập văn hóa kỷ luật thép minh bạch, công bằng tuyệt đối và không có bất kỳ tranh cãi nào.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          <code>diem_danh_bot.py</code> • <code>setup_attendance_sheet.py</code> • <code>sync_attendance_sheets.py</code> • <code>render_daily_recap_card.py</code> • SQLite DB <code>diem_danh.db</code> • Thẻ ảnh HTML <code>recap_daily_attendance.png</code>.
        </p>
      </div>
    `
  },

  5: {
    id: 'NTB-RISK-05',
    badge: 'CASE 05 · LOGISTICS CONTROL TOWER · EARLY WARNING',
    title: 'Chốt Hàng Về 08:05 & Thuật Toán Risk Score Trạm Bất Ổn',
    role: 'Kiểm Soát Nút Thắt Cổ Chai Logistics · Python Playwright, Multi-factor Risk Engine, Automated GTalk',
    desc: 'Phát hiện hiệu ứng domino vận chuyển trước khi bưu cục rơi vào trạng thái vỡ trạm. Thuật toán Risk Score đa biến (0 - 100 điểm) quét lúc 08:05: kết hợp sản lượng hàng về > 130%, thiếu hụt nhân sự > 20% và tồn cũ > 30% để phát lệnh điều phối xe tải và nhân lực cứu viện trước 4-6 tiếng.',
    metrics: [
      { val: 'Sớm 4 – 6 Giờ', lbl: 'Nhận diện nguy cơ trước khi vỡ trạm' },
      { val: '08:05 Sáng', lbl: 'Chốt toàn bộ dữ liệu cập bến' },
      { val: '100% SLA', lbl: 'Bảo vệ cam kết giao hàng trong ngày' }
    ],
    tech: ['Python 3.11', 'Playwright Headless Crawler', 'Pandas Risk Algorithm', 'Looker/BI Integration', 'Google Chat Alerting', 'Windows Task Scheduler'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-sky, #38bdf8); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#38bdf8; border-radius:50%; box-shadow:0 0 8px #38bdf8;"></span>
          THUẬT TOÁN RISK SCORE & CẢNH BÁO VỠ TRẠM 08:05
        </span>
        <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-dim);">File: chot_hang_ve_08h05.py</span>
      </div>
      <div style="background:rgba(56,189,248,0.06); border:1px solid rgba(56,189,248,0.25); border-radius:8px; padding:10px; margin-bottom:10px;">
        <div style="font-size:0.72rem; color:#38bdf8; font-weight:700; margin-bottom:6px;">
          ⚡ 3 CHỈ SỐ RISK SCORE ĐA BIẾN (0 - 100 ĐIỂM):
        </div>
        <div style="display:grid; grid-template-columns:1fr; gap:5px; font-size:0.73rem;">
          <div style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:4px;">
            <span>1. Tải trọng hàng về lúc 08h05:</span>
            <span style="color:var(--accent-rose); font-family:var(--font-mono);">&gt; 130% Công suất</span>
          </div>
          <div style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:4px;">
            <span>2. Tỷ lệ thiếu hụt quân số:</span>
            <span style="color:var(--accent-amber); font-family:var(--font-mono);">&gt; 20% Định biên</span>
          </div>
          <div style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:4px;">
            <span>3. Tồn TTS hôm trước dồn sang:</span>
            <span style="color:var(--accent-rose); font-family:var(--font-mono);">&gt; 30% Sản lượng</span>
          </div>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-dim);">
        <span style="color:var(--accent-rose);">⚠️ Risk Score &gt; 75/100: Kích hoạt báo động đỏ</span>
        <span style="color:var(--accent-lime); font-family:var(--font-mono);">Phát lệnh: 08:30 sáng</span>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Dây chuyền vận hành logistics có tính liên hoàn cao: Chỉ cần xe tải trung chuyển liên tỉnh về trễ 30 phút, bưu cục sẽ chia chọn trễ 1 tiếng, dẫn đến việc bưu tá xuất bến muộn và toàn bộ tỷ lệ giao thành công (GTC) buổi sáng bị sụp đổ.
        </p>
        <p class="m-text" style="margin-top:8px;">
          Bưu cục rơi vào trạng thái "vỡ trạm", hàng hóa chất đống tràn ra lối đi mà cấp trên chỉ biết khi sự đã rồi vào cuối buổi chiều — khi không còn thời gian để khắc phục.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán & Insight bóc tách dữ liệu</h4>
        <p class="m-text">Thủy thiết lập mốc chốt hàng về lúc 08:05 và thuật toán <strong>Risk Score đa biến</strong>:</p>
        <ul class="m-list">
          <li><strong>Chốt hàng về lúc 08:05:</strong> Đo lường chính xác tổng khối lượng kiện hàng đã cập bến bưu cục ngay đầu ngày để dự báo áp lực ca phát.</li>
          <li><strong>Thuật toán Risk Score (0 - 100 điểm):</strong> Đánh giá mức độ rủi ro dựa trên trọng số 3 yếu tố:
            <br>• Lượng hàng về vượt quá 130% năng lực thông qua của bưu cục.
            <br>• Quân số bưu tá đi làm thiếu hụt &gt; 20% so với định biên nhân sự.
            <br>• Tỷ lệ hàng tồn TTS từ ngày hôm trước dồn sang vượt &gt; 30%.
          </li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🎯 Quyết định & Hành động can thiệp (Actionable Decision)</h4>
        <p class="m-text">
          Ngay khi Risk Score vượt ngưỡng 75 điểm, hệ thống tự động bắn tín hiệu cảnh báo đỏ lên kênh Điều Phối Vùng trước 08:30 sáng. Lãnh đạo lập tức chỉ đạo xe tải tuyến lân cận chuyển hướng dỡ bớt hàng và điều động đội bưu tá cơ động sang hỗ trợ chia chọn ngay lập tức, dập tắt nguy cơ ùn ứ trước khi nó bùng phát.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Cảnh báo sớm từ 4 đến 6 tiếng</strong> trước khi bưu cục rơi vào nguy cơ vỡ trạm.</li>
          <li><strong>Bảo vệ 100% cam kết SLA</strong> giao nhận trong ngày đối với các đối tác sàn TMĐT (Shopee, TikTok Shop, Lazada).</li>
          <li>Tối ưu hóa hành trình xe tải trung chuyển, hạn chế tối đa việc xe chạy rỗng hoặc xe bị ách tắc tại bưu cục.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          <code>chot_hang_ve_08h05.py</code> • <code>generate_unstable_hubs_report.py</code> • <code>download_report_gtc_db.py</code> • Playwright Headless Web Crawler • Ảnh phân tích <code>top10_fd_t2_den_gio.png</code>.
        </p>
      </div>
    `
  },

  6: {
    id: 'NTB-TICKET-06',
    badge: 'CASE 06 · REALTIME DISPATCH · REGEX NLP',
    title: 'Flask Webhook Server Phân Luồng Ticket Khiếu Nại Realtime',
    role: 'Xử Lý Sự Cố Khách Hàng Realtime · Python Flask, Multi-threading, Regex NLP, Google Sheet Routing',
    desc: 'Máy chủ Flask Webhook đa luồng tiếp nhận tin nhắn khiếu nại khách hàng, sử dụng biểu thức chính quy Regex NLP bóc tách mã vận đơn và tên AM trong tích tắc, tự động tra cứu bảng mapping Group ID và bắn thẳng về nhóm Kaizen của 5 tỉnh chỉ trong < 30 giây.',
    metrics: [
      { val: '< 30 Giây', lbl: 'Tốc độ phân luồng ticket tự động' },
      { val: '-80% Thời Gian', lbl: 'Rút ngắn quy trình từ 6-12h xuống nửa phút' },
      { val: '5 Tỉnh NTB', lbl: 'Phân luồng chính xác không cần con người can thiệp' }
    ],
    tech: ['Python Flask Framework', 'ThreadPoolExecutor Multi-threading', 'Regex Natural Language Processing', 'Google Chat Webhooks', 'Google Sheets Mapping'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-purple); display:flex; align-items:center; gap:6px;">
          <span style="width:7px; height:7px; background:#a855f7; border-radius:50%; box-shadow:0 0 8px #a855f7;"></span>
          MÁY CHỦ FLASK WEBHOOK & REGEX NLP TICKET
        </span>
        <span style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-dim);">File: ticket_webhook_server.py</span>
      </div>
      <div style="background:rgba(168,85,247,0.06); border:1px solid rgba(168,85,247,0.25); border-radius:8px; padding:10px; margin-bottom:10px;">
        <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.73rem; margin-bottom:6px;">
          <span>Quy trình luồng xử lý:</span>
          <span style="color:var(--accent-lime); font-family:var(--font-mono); font-weight:700;">Tốc độ: &lt; 30 Giây</span>
        </div>
        <div style="background:rgba(0,0,0,0.3); border-radius:4px; padding:8px; font-family:var(--font-mono); font-size:0.7rem; line-height:1.6; color:var(--text-muted);">
          [Ticket Incoming] → [Flask Multi-thread Server] → [Regex NLP Extract MVD & AM] → [Lookup Sheet Group ID] → [Push GTalk Kaizen 5 Tỉnh]
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-dim);">
        <span style="color:var(--accent-lime);">✓ Xóa bỏ hoàn toàn thao tác copy-paste thủ công</span>
        <span style="color:var(--accent-cyan); font-family:var(--font-mono);">Multi-threading</span>
      </div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Bối cảnh & Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">
          Các phiếu khiếu nại khẩn cấp của khách hàng (hàng thất lạc, tài xế có thái độ không chuẩn mực, sai địa chỉ giao) khi gửi vào nhóm chat chung thường bị trôi tin nhắn nhanh chóng do lượng trao đổi quá lớn.
        </p>
        <p class="m-text" style="margin-top:8px;">
          Trước đây, nhân viên trực ca phải đọc từng tin nhắn, tra cứu thủ công và copy-paste sang nhóm chat của từng tỉnh. Quy trình này thường mất từ 6 đến 12 tiếng mới đến được tay AM phụ trách, khiến khách hàng bức xúc và tỷ lệ hủy đơn tăng cao.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán & Insight bóc tách dữ liệu</h4>
        <p class="m-text">Thủy xây dựng máy chủ <strong>Flask Webhook Server</strong> xử lý đa luồng:</p>
        <ul class="m-list">
          <li><strong>Kiến trúc đa luồng (Multi-threading):</strong> Sử dụng ThreadPoolExecutor để tiếp nhận và xử lý đồng thời hàng chục yêu cầu webhook mà không bị nghẽn mạng.</li>
          <li><strong>Biểu thức chính quy Regex NLP:</strong> Tự động bóc tách mã vận đơn (MVD), mã trạm và tên quản lý AM được nhắc tới trong tin nhắn khiếu nại.</li>
          <li><strong>Bảng định tuyến tự động (Dynamic Routing):</strong> Tra cứu bảng ánh xạ Group ID trên Google Sheet để xác định chính xác nhóm chat Kaizen của tỉnh liên quan (Bình Thuận, Ninh Thuận, Khánh Hòa, Lâm Đồng, Đắk Nông).</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🎯 Quyết định & Hành động can thiệp (Actionable Decision)</h4>
        <p class="m-text">
          Tin nhắn cảnh báo kèm đường link tra cứu đơn hàng được bắn trực tiếp vào nhóm Kaizen của tỉnh tương ứng chỉ trong <strong>dưới 30 giây</strong> kể từ khi phát sinh sự cố. AM và Trưởng bưu cục lập tức nhận được thông tin để xử lý ngay tại hiện trường.
        </p>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">💰 Kết quả kinh doanh & Business ROI</h4>
        <ul class="m-list">
          <li><strong>Rút ngắn 80% thời gian xử lý</strong> khiếu nại của khách hàng, từ nửa ngày xuống dưới nửa phút.</li>
          <li>Gia tăng đáng kể chỉ số hài lòng của khách hàng (CSAT) và ngăn chặn tình trạng khách hủy đơn hàng loạt do chờ đợi quá lâu.</li>
          <li>Giải phóng 100% thời gian trực kênh và thao tác copy-paste thủ công của trợ lý vận hành.</li>
        </ul>
      </div>

      <div class="m-section">
        <h4 class="m-section-title">🛠️ Kiến trúc kỹ thuật & Files thực thi</h4>
        <p class="m-text">
          <code>ticket_webhook_server.py</code> • <code>ticket.py</code> • <code>ticket_glt.py</code> • <code>kaizen_bot.py</code> • Flask Microframework • ThreadPoolExecutor • Google Chat Incoming Webhooks.
        </p>
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

