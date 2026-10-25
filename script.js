/**
 * TRAN QUYNH THUY — PORTFOLIO INTERACTION ENGINE
 * Features:
 * 1. Interactive Logistics Sorting Canvas (Hero Data Packets)
 * 2. Case Studies Dynamic Previewer & Deep Modal
 * 3. Interactive Career Journey Path (SVG Nodes)
 * 4. Control Tower Live Simulator (Interactive Terminal & Telegram Bot Alert)
 * 5. 1-Click Clipboard Copy & CV Modal Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initCaseStudies();
  initCareerJourney();
  initSimulator();
  initContactAndModals();
  initLiveTicker();
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
    badge: 'CASE 01 · AUTOMATION',
    title: 'Hệ Sinh Thái NTB Operations Control Tower',
    role: 'Trợ lý Giám Đốc Vùng · Python & VPS Data Pipeline · 2026',
    desc: 'Thiết kế và triển khai kiến trúc Control Tower tự động hóa cho 5 tỉnh Nam Trung Bộ. Thay thế hoàn toàn quy trình tổng hợp thủ công buổi sáng, giám sát 4 chỉ số sinh mệnh (%OPR, %ODR, %FD, %GTC) và gửi cảnh báo can thiệp trực tiếp vào Telegram của 18 Quản lý khu vực.',
    metrics: [
      { val: '85%', lbl: 'Giảm thời gian làm báo cáo thủ công' },
      { val: '18 AMs', lbl: 'Nhận thông báo can thiệp tức thì' },
      { val: '5 Tỉnh', lbl: 'Bao phủ toàn diện Nam Trung Bộ' }
    ],
    tech: ['Python 3.11', 'Telegram Bot API', 'Google Sheets API', 'Linux Cron VPS', 'Pandas Pipeline'],
    visualHtml: `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-lime);">🟢 MASTER PULSE: LIVE</span>
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-dim);">CRON: 07:15, 09:30, 11:30</span>
      </div>
      <div style="background:rgba(255,255,255,0.04); border-radius:8px; padding:12px; display:grid; grid-template-columns:repeat(4,1fr); gap:8px; text-align:center;">
        <div><div style="color:var(--accent-emerald); font-weight:700; font-size:1.1rem;">97.2%</div><div style="font-size:0.68rem; color:#888;">%OPR LẤY</div></div>
        <div><div style="color:var(--accent-lime); font-weight:700; font-size:1.1rem;">94.8%</div><div style="font-size:0.68rem; color:#888;">%GTC GIAO</div></div>
        <div><div style="color:var(--accent-cyan); font-weight:700; font-size:1.1rem;">1.2%</div><div style="font-size:0.68rem; color:#888;">%ODR TRỄ</div></div>
        <div><div style="color:var(--accent-amber); font-weight:700; font-size:1.1rem;">92.5%</div><div style="font-size:0.68rem; color:#888;">%FD CA 1</div></div>
      </div>
      <div style="margin-top:10px; font-size:0.74rem; color:var(--text-dim); text-align:right;">✓ Auto sync Google Sheets AM & TG Group</div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">Toàn vùng NTB gồm 5 tỉnh với địa bàn trải rộng từ cao nguyên (Lâm Đồng, Đắk Nông) đến duyên hải (Khánh Hòa, Ninh Thuận, Bình Thuận). Hằng ngày, Ban Giám đốc và 18 Account Manager (AM) phải tổng hợp thủ công hàng chục file dữ liệu rời rạc từ hệ thống. Việc này làm chậm trễ quyết định can thiệp đến tận 11h trưa — khi ca giao sáng gần như đã chốt sổ.</p>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">🔍 Giải pháp & Thuật toán triển khai</h4>
        <ul class="m-list">
          <li><strong>Data Pipeline trên Linux VPS:</strong> Viết pipeline tự động trích xuất dữ liệu từ WMS & Data Warehouse nội bộ bằng Python, làm sạch dữ liệu và tổng hợp theo từng đơn vị bưu cục/AM.</li>
          <li><strong>Cron Schedule thông minh:</strong> Lên lịch chạy vào các mốc vàng (07h15 đầu ca, 09h30 kiểm soát tồn, 11h30 chốt ca sáng, 15h00 tăng cường ca chiều).</li>
          <li><strong>Phân luồng thông tin:</strong> Tự động ghi dữ liệu vào Google Sheets riêng của từng AM và bắn message tổng quan có gắn mention đích danh người phụ trách vào nhóm điều hành.</li>
        </ul>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">💰 Tác động kinh doanh (Measurable Business Impact)</h4>
        <p class="m-text">Cắt giảm 85% thời gian tạo báo cáo thủ công mỗi ngày. Giám đốc Vùng có bức tranh toàn cảnh chỉ sau 5 phút mở ca, phát hiện và chỉ đạo xử lý kịp thời các bưu cục có nguy cơ vỡ SLA giao nhận.</p>
      </div>
    `
  },
  2: {
    id: 'NTB-FRAUD-02',
    badge: 'CASE 02 · RISK CONTROL',
    title: 'Radar Bắt Quả Tang Fake GPS & Chặn Chiếm Dụng COD',
    role: 'Quản trị rủi ro & Chống thất thoát · 2026',
    desc: 'Thuật toán kết hợp định vị không gian (Haversine Distance) và lịch sử giao nhận nhằm phát hiện bưu tá đứng xa địa chỉ khách hàng để bấm cập nhật "Khách hoãn / Không liên lạc", ngăn chặn hành vi gối đầu tiền mặt COD.',
    metrics: [
      { val: '95%', lbl: 'Triệt tiêu rủi ro chiếm dụng dòng tiền' },
      { val: '>2.000m', lbl: 'Ngưỡng phát hiện gian lận tọa độ' },
      { val: 'Top 5', lbl: 'Nhân viên rủi ro cao cảnh báo cho AM' }
    ],
    tech: ['Haversine Algorithm', 'Geolocation Analysis', 'Python Fraud Filter', 'Telegram Direct Alert'],
    visualHtml: `
      <div style="background:rgba(244,63,94,0.08); border:1px solid rgba(244,63,94,0.3); border-radius:8px; padding:14px; margin-bottom:8px;">
        <div style="color:var(--accent-rose); font-weight:700; font-size:0.85rem; margin-bottom:6px;">⚠️ CẢNH BÁO GIAN LẬN TỌA ĐỘ (FAKE GPS)</div>
        <div style="font-family:var(--font-mono); font-size:0.75rem; color:#fff;">Đơn: <strong>GHN-7782910</strong> · COD: <span style="color:var(--accent-lime);">1.450.000đ</span></div>
        <div style="font-family:var(--font-mono); font-size:0.75rem; color:#cbd5e1;">Khoảng cách check-in: <span style="color:var(--accent-rose); font-weight:bold;">2.840m</span> so với khách</div>
        <div style="font-family:var(--font-mono); font-size:0.72rem; color:#94a3b8; margin-top:4px;">Bưu tá: N.V.A (Bưu cục Di Linh) · Trạng thái: Hoãn 3 ngày liên tiếp</div>
      </div>
      <div style="font-size:0.72rem; color:var(--accent-emerald);">➔ Đã kích hoạt alert: Yêu cầu AM kiểm tra thùng xe trước 11h00</div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">Bưu tá thu tiền mặt COD từ khách hàng nhưng không nộp về công ty mà dùng tiền đơn sau đắp đơn trước (gối đầu COD). Để đối phó hệ thống, bưu tá đứng tại quán cà phê hoặc ở nhà rồi bấm "Khách hẹn giao lại" hoặc "Không nghe máy", dẫn đến tỷ lệ giao trễ tăng cao và nguy cơ mất tiền mặt hàng chục triệu đồng.</p>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán lọc rủi ro (Fraud Detection Algorithm)</h4>
        <ul class="m-list">
          <li><strong>Điều kiện 1 (Giá trị rủi ro):</strong> Tiền thu hộ COD > 400.000 VNĐ.</li>
          <li><strong>Điều kiện 2 (Tần suất bất thường):</strong> Đơn hàng bị cập nhật trạng thái hoãn hẹn >= 2 ngày liên tục.</li>
          <li><strong>Điều kiện 3 (Độ lệch GPS):</strong> Sử dụng công thức Haversine tính khoảng cách giữa tọa độ check-in trên App bưu tá và tọa độ thực tế của khách hàng. Nếu khoảng cách lệch > 2.000m, gắn cờ "Nghi vấn Fake GPS".</li>
        </ul>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">💰 Tác động kinh doanh (Measurable Business Impact)</h4>
        <p class="m-text">Triệt tiêu 95% hành vi chiếm dụng COD tại các bưu cục vùng sâu. Bảo vệ an toàn dòng tiền ngân quỹ, đồng thời răn đe triệt để hiện tượng bưu tá ngồi một chỗ bấm cập nhật ảo.</p>
      </div>
    `
  },
  3: {
    id: 'NTB-GTC-03',
    badge: 'CASE 03 · STRATEGY',
    title: 'Dynamic Target Staircase — Giải Cứu 14 Bưu Cục Đáy',
    role: 'Operations Strategist · Tối ưu hiệu quả giao · 2026',
    desc: 'Thuật toán bậc thang động thay thế con số chỉ tiêu cứng nhắc bằng thang bậc chia nhỏ theo khung giờ, tạo động lực tâm lý cho bưu tá tại các bưu cục đồi núi khó khăn vươn lên mốc giao thành công chuẩn.',
    metrics: [
      { val: '+12.4%', lbl: 'Tăng trưởng GTC nhóm đáy' },
      { val: '14 BC', lbl: 'Được cứu hộ thoát nhóm báo động' },
      { val: '2 Giờ/Lần', lbl: 'Tự động tính lại nấc thang' }
    ],
    tech: ['Dynamic Thresholds', 'Gamification Logic', 'Performance Modeling', 'Real-time Telegram Notification'],
    visualHtml: `
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;">THANG CỨU HỘ ĐỘNG THEO NĂNG LỰC:</div>
      <div style="display:flex; gap:6px; margin-bottom:12px;">
        <span style="flex:1; background:rgba(244,63,94,0.2); border:1px solid var(--accent-rose); color:#fff; text-align:center; padding:6px; border-radius:4px; font-size:0.75rem;">Bậc 1: 45%</span>
        <span style="flex:1; background:rgba(245,158,11,0.2); border:1px solid var(--accent-amber); color:#fff; text-align:center; padding:6px; border-radius:4px; font-size:0.75rem;">Bậc 2: 55%</span>
        <span style="flex:1; background:rgba(16,185,129,0.2); border:1px solid var(--accent-emerald); color:#fff; text-align:center; padding:6px; border-radius:4px; font-size:0.75rem;">Bậc 3: 70%</span>
        <span style="flex:1; background:rgba(212,242,54,0.2); border:1px solid var(--accent-lime); color:#fff; text-align:center; padding:6px; border-radius:4px; font-size:0.75rem;">Chuẩn: 85%</span>
      </div>
      <div style="font-size:0.75rem; color:var(--text-muted);">Bưu cục Krông Nô (Đắk Nông): Vượt Bậc 1 (48%) lúc 10h15 ➔ Kích hoạt Bậc 2</div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">Tại các địa bàn đồi núi hiểm trở như Đắk Nông, Lâm Đồng, bán kính giao hàng rộng và giao thông khó khăn khiến tỷ lệ Giao thành công (GTC) sáng thường chỉ đạt 35-45%. Nếu áp chung chỉ tiêu 85% của vùng, bưu tá cảm thấy bất khả thi và buông xuôi, bỏ ca không giao tiếp.</p>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">🔍 Thuật toán Bậc thang động (Dynamic Target Staircase)</h4>
        <ul class="m-list">
          <li><strong>Phân cụm bưu cục:</strong> Tự động xếp hạng và nhận diện 14 bưu cục có GTC dưới 55% lúc 09h30 sáng.</li>
          <li><strong>Cơ chế thang động:</strong> Hạ mục tiêu tức thời xuống các nấc thang vừa sức: [40% -> 45% -> 50% -> 60%]. Khi bưu tá vượt một mốc, Bot gửi tin chúc mừng và mở khóa nấc thang tiếp theo.</li>
          <li><strong>Tính toán lượng đơn cần giao:</strong> Quy đổi cụ thể: "Chỉ cần giao thêm 8 đơn nữa trước 11h30 để chạm mốc an toàn".</li>
        </ul>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">💰 Tác động kinh doanh (Measurable Business Impact)</h4>
        <p class="m-text">Kéo toàn bộ 14 bưu cục khó khăn nhất vùng thoát khỏi nhóm báo động đỏ. Tăng trưởng tỷ lệ GTC trung bình của nhóm này thêm +12.4%, đóng góp trực tiếp vào thành tích chung của toàn vùng Nam Trung Bộ.</p>
      </div>
    `
  },
  4: {
    id: 'KA-FLOW-04',
    badge: 'CASE 04 · AWARD 2025',
    title: 'Tái Cấu Trúc Shipping Status Flow & Cắt Giảm 20% Contact Rate',
    role: 'Key Account Executive · Sàn Shopee, Lazada, Tiki · 2025 – 2026',
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
  },
  5: {
    id: 'NTB-STAFF-05',
    badge: 'CASE 05 · STAFFING',
    title: 'Staffing Capacity Model & Cảnh Báo Bưu Tá Bỏ Tuyến',
    role: 'Điều hành Nguồn lực & Năng suất · Vùng NTB · 2026',
    desc: 'Mô hình giám sát năng suất phát ca và tỷ lệ bưu tá rời tuyến đột xuất, cân đối số lượng bưu tá cần thiết theo sản lượng dự báo theo ngày, loại bỏ tình trạng ùn tắc hàng hóa ca chiều.',
    metrics: [
      { val: '100%', lbl: 'Kiểm soát bưu tá off tuyến' },
      { val: '<14h00', lbl: 'Cảnh báo tăng cường ca chiều' },
      { val: '98.5%', lbl: 'Đơn ca 2 được xuất kho kịp thời' }
    ],
    tech: ['Staffing Model', 'Delivery Velocity Tracker', 'Capacity Planning', 'Telegram AM Alert'],
    visualHtml: `
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;">THEO DÕI NĂNG SUẤT PHÁT CA THEO GIỜ:</div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        <div style="display:flex; justify-content:space-between; font-size:0.75rem;">
          <span>BC Cam Ranh (Khánh Hòa):</span>
          <span style="color:var(--accent-emerald);">Đạt chuẩn (48 đơn/người)</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem;">
          <span>BC Đắk Mil (Đắk Nông):</span>
          <span style="color:var(--accent-rose); font-weight:bold;">Thiếu 2 bưu tá ca chiều ⚠️</span>
        </div>
      </div>
      <div style="margin-top:8px; font-size:0.72rem; color:var(--accent-lime);">➔ Tự động đề xuất AM điều chuyển 2 bưu tá từ tuyến phụ trợ</div>
    `,
    deepDetail: `
      <div class="m-section">
        <h4 class="m-section-title">⚠️ Nỗi đau vận hành (Operational Pain Point)</h4>
        <p class="m-text">Tình trạng bưu tá tự ý nghỉ ca chiều hoặc off tuyến đột xuất mà bưu cục không nắm được kịp thời, dẫn đến hàng trăm đơn hàng ca chiều bị om tại kho, phát sinh khiếu nại trễ hẹn và tồn đọng sang ngày hôm sau.</p>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">🔍 Giải pháp kỹ thuật & Thuật toán</h4>
        <ul class="m-list">
          <li><strong>Theo dõi vận tốc giao hàng (Delivery Velocity):</strong> Tính toán số đơn giao thành công/giờ của từng bưu tá. Nếu sau 14h00 bưu tá không có thêm bất kỳ quét mã nào, hệ thống phát tín hiệu cảnh báo.</li>
          <li><strong>Mô hình cân đối định biên (Staffing Optimizer):</strong> Dựa trên lượng hàng tồn kho và hàng đang luân chuyển về bưu cục, tính toán số lượng bưu tá tối thiểu cần ra đường để giải tỏa trước giờ cutoff.</li>
        </ul>
      </div>
      <div class="m-section">
        <h4 class="m-section-title">💰 Tác động kinh doanh (Measurable Business Impact)</h4>
        <p class="m-text">Chấm dứt hoàn toàn hiện tượng bưu cục bị "vỡ trận" ca chiều. Giúp Trưởng bưu cục và AM chủ động điều chuyển nhân sự giữa các tuyến lân cận từ trước 14h00.</p>
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
      'Lập báo cáo vận hành, kinh doanh và theo dõi PFM cho Giám đốc Vùng; tổng hợp dữ liệu KPI 5 tỉnh và 18 Quản lý khu vực (AM).',
      'Xây dựng pipeline báo cáo tự động (Python, Google Apps Script), rút ngắn 85% thời gian thủ công và theo dõi KPI thời gian thực (%OPR, %ODR, %FD).',
      'Phân tích rủi ro vận hành: phát hiện bưu tá gian lận GPS, chặn nguy cơ chiếm dụng dòng tiền COD, follow bưu tá off tuyến đột xuất.',
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
  cod: {
    terminalLines: [
      { text: '[SCAN] Quét cơ sở dữ liệu COD 5 tỉnh: Phát hiện đơn hàng nghi vấn tại Bưu cục Di Linh...', type: 'warn' },
      { text: '[ALGO] Tính khoảng cách Haversine giữa GPS bưu tá và tọa độ khách: Lệch 2.840 mét!', type: 'err' },
      { text: '[CHECK] Tiền COD: 1.850.000đ · Số lần cập nhật hoãn hẹn: 3 ngày liên tiếp.', type: 'warn' },
      { text: '[DECISION] Đơn hàng vượt ngưỡng an toàn! Kích hoạt Bot gửi điện khẩn cho AM Lâm Đồng.', type: 'success' }
    ],
    tg: {
      time: '10:05',
      channel: 'AM_LAM_DONG_CANH_BAO',
      text: `🚨 <b>CẢNH BÁO RỦI RO CHIẾM DỤNG COD & FAKE GPS</b>
📍 <b>Bưu cục:</b> Di Linh (Lâm Đồng)
📦 <b>Mã vận đơn:</b> GHN-8839219
💰 <b>Tiền thu hộ COD:</b> 1.850.000 VNĐ (Hoãn 3 ngày)
🛰️ <b>Tọa độ check-in:</b> Lệch <b>2.840m</b> so với địa chỉ người nhận.
👤 <b>Bưu tá phụ trách:</b> Nguyễn Văn A

👉 <b>YÊU CẦU HÀNH ĐỘNG:</b>
AM vui lòng trực tiếp xuống bưu cục hoặc gọi điện kiểm tra túi hàng bưu tá <b>trước 11h00 trưa</b> để ngăn ngừa thất thoát ngân quỹ!`
    }
  },
  bottom_bc: {
    terminalLines: [
      { text: '[PULSE] 10:30 Kiểm tra Giao thành công (GTC) toàn vùng: Phát hiện 1 bưu cục dưới ngưỡng...', type: 'warn' },
      { text: '[INFO] Bưu cục Krông Nô (Đắk Nông): GTC hiện tại đạt 39.2% (Nguy cơ vỡ SLA).', type: 'err' },
      { text: '[DYNAMIC TARGET] Hạ mục tiêu tức thời xuống Bậc 1: Cần giao thêm 9 đơn để đạt 48%.', type: 'warn' },
      { text: '[PUSH] Đã gửi thông báo giải cứu và danh sách 9 khách hàng ưu tiên cho AM Đắk Nông.', type: 'success' }
    ],
    tg: {
      time: '10:31',
      channel: 'AM_DAK_NONG_DIEU_HANH',
      text: `🎯 <b>THANG CỨU HỘ ĐỘNG — GIẢI CỨU BƯU CỤC KRÔNG NÔ</b>
📊 <b>Tình trạng:</b> GTC lúc 10h30 đạt <b>39.2%</b> (Đáy vùng)
⚡ <b>Mục tiêu Bậc 1 kích hoạt:</b> Đạt <b>48.0%</b> trước 11h30 trưa.
📦 <b>Hành động cụ thể:</b> Chỉ cần hoàn tất thêm <b>9 đơn hàng</b> nữa trên tuyến chính!

👉 <b>ĐÃ ĐẨY LINK GOOGLE SHEET:</b> Danh sách 9 khách hàng có tỷ lệ nghe máy cao nhất buổi sáng. Đề nghị Trưởng bưu cục tập trung ưu tiên phát dứt điểm!`
    }
  },
  drop_shopee: {
    terminalLines: [
      { text: '[MONITOR] Quét kết nối sàn TMĐT: Phát hiện kiện hàng Shopee bị giữ tại Hub Nha Trang...', type: 'warn' },
      { text: '[TIME] Thời gian tồn tại bãi trung chuyển: 14 giờ (Sắp chạm ngưỡng cutoff 11h30).', type: 'err' },
      { text: '[ACTION] Tự động gán cờ "Hàng ưu tiên sàn", kích hoạt lệnh đẩy chuyến xe sớm.', type: 'success' }
    ],
    tg: {
      time: '10:45',
      channel: 'HUB_NHA_TRANG_TMDT',
      text: `📦 <b>CẢNH BÁO NGUY CƠ RỚT KẾT NỐI SÀN SHOPEE</b>
🏭 <b>Địa điểm:</b> Kho phân loại Hub Nha Trang (Khánh Hòa)
⏰ <b>Giờ Cutoff xe kế tiếp:</b> 11h30 trưa
🚨 <b>Số lượng kiện có nguy cơ trễ SLA:</b> 142 đơn

👉 <b>CHỈ ĐẠO:</b> Đội ngũ phân loại ưu tiên cho 142 kiện này lên xe trung chuyển chuyến 11h15 đi Cam Ranh & Ninh Thuận để bảo toàn 100% SLA sàn TMĐT!`
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

  let activeScenario = 'cod';

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
    '5 Tỉnh Nam Trung Bộ • 18 Account Managers • Tự động hóa Pipeline thời gian thực',
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
