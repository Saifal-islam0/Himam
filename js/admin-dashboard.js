/* ============================================================
   Permission matrix data
   Source of truth for the roles brief:
   - Super Admin: full access to everything
   - Site Manager: pages/content, services/events, forms/bookings,
     reports — but can NEVER delete the Super Admin or change site
     ownership, regardless of other grants.
   - Content Editor: create/edit content, upload images, save
     drafts — publishing is conditional on approval unless granted.
   - Customer Service: view/update contact requests + notes only,
     no access to site pages or settings.
   ============================================================ */
const PERMISSIONS_MATRIX = [
  { label: "إدارة المستخدمين",                     super: "yes", manager: "no",  editor: "no",  support: "no"  },
  { label: "إدارة الصلاحيات",                       super: "yes", manager: "no",  editor: "no",  support: "no"  },
  { label: "تغيير الإعدادات العامة",                super: "yes", manager: "no",  editor: "no",  support: "no"  },
  { label: "الاطلاع على السجلات الأمنية",           super: "yes", manager: "no",  editor: "no",  support: "no"  },
  { label: "إدارة التكاملات",                       super: "yes", manager: "no",  editor: "no",  support: "no"  },
  { label: "إنشاء المديرين أو حذفهم",               super: "yes", manager: "no",  editor: "no",  support: "no"  },
  { label: "حذف المدير الأعلى / نقل ملكية الموقع",  super: "yes", manager: "no",  editor: "no",  support: "no"  },
  { label: "إدارة الصفحات والمحتوى",                super: "yes", manager: "yes", editor: "no",  support: "no"  },
  { label: "إدارة الخدمات والفعاليات",              super: "yes", manager: "yes", editor: "no",  support: "no"  },
  { label: "مراجعة النماذج والحجوزات",              super: "yes", manager: "yes", editor: "no",  support: "no"  },
  { label: "الاطلاع على التقارير",                  super: "yes", manager: "yes", editor: "no",  support: "no"  },
  { label: "إنشاء وتعديل المحتوى",                  super: "yes", manager: "yes", editor: "yes", support: "no"  },
  { label: "رفع الصور",                              super: "yes", manager: "yes", editor: "yes", support: "no"  },
  { label: "حفظ المسودات",                          super: "yes", manager: "yes", editor: "yes", support: "no"  },
  { label: "نشر المحتوى مباشرة",                    super: "yes", manager: "yes", editor: "cond", support: "no" },
  { label: "عرض رسائل التواصل والطلبات",            super: "yes", manager: "yes", editor: "no",  support: "yes" },
  { label: "تحديث حالة الطلب",                      super: "yes", manager: "yes", editor: "no",  support: "yes" },
  { label: "إضافة ملاحظات على الطلبات",             super: "yes", manager: "yes", editor: "no",  support: "yes" },
];

const ICON_YES  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 12l5 5L20 6"/></svg>';
const ICON_NO   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const ICON_COND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>';

function renderCell(state){
  if(state === "yes")  return `<span class="matrix-yes" title="ممنوحة">${ICON_YES}</span>`;
  if(state === "cond") return `<span class="matrix-cond" title="مشروطة بالاعتماد أو صلاحية إضافية">${ICON_COND}</span>`;
  return `<span class="matrix-no" title="غير ممنوحة">${ICON_NO}</span>`;
}

function renderMatrix(){
  const body = document.getElementById('matrixBody');
  if(!body) return;
  body.innerHTML = PERMISSIONS_MATRIX.map(row => `
    <tr>
      <td class="cap-col">${row.label}</td>
      <td>${renderCell(row.super)}</td>
      <td>${renderCell(row.manager)}</td>
      <td>${renderCell(row.editor)}</td>
      <td>${renderCell(row.support)}</td>
    </tr>
  `).join('');
}

/* ============================================================
   Section navigation
   ============================================================ */
const SECTION_META = {
  overview:     { title: "نظرة عامة",            sub: "ملخص أداء الموقع اليوم" },
  pages:        { title: "صفحات الموقع",         sub: "إدارة محتوى وحالة كل صفحة في الموقع" },
  users:        { title: "إدارة المستخدمين",     sub: "جميع حسابات لوحة التحكم وأدوارها" },
  permissions:  { title: "إدارة الصلاحيات",      sub: "الصلاحيات الممنوحة لكل دور" },
  admins:       { title: "إنشاء وحذف المديرين",  sub: "يقتصر هذا القسم على المدير الأعلى" },
  settings:     { title: "الإعدادات العامة",     sub: "بيانات الموقع الأساسية ووضع الصيانة" },
  security:     { title: "السجلات الأمنية",      sub: "سجل الدخول والتغييرات الحساسة" },
  integrations: { title: "إدارة التكاملات",      sub: "الخدمات الخارجية المرتبطة بالموقع" },
};

function dashNavigate(sectionId){
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dash-nav-item').forEach(b => b.classList.remove('active'));

  const target = document.getElementById('sec-' + sectionId);
  const navBtn = document.querySelector(`.dash-nav-item[data-section="${sectionId}"]`);
  if(target) target.classList.add('active');
  if(navBtn) navBtn.classList.add('active');

  const meta = SECTION_META[sectionId];
  if(meta){
    document.getElementById('topbarTitle').textContent = meta.title;
    document.getElementById('topbarSub').textContent = meta.sub;
  }

  // close mobile sidebar after navigating
  document.getElementById('dashSidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('show');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  renderMatrix();

  document.querySelectorAll('.dash-nav-item[data-section]').forEach(btn => {
    btn.addEventListener('click', () => dashNavigate(btn.getAttribute('data-section')));
  });

  // mobile sidebar toggle
  const sidebar = document.getElementById('dashSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const mobileToggle = document.getElementById('mobileSidebarToggle');
  if(mobileToggle){
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('show');
    });
  }
  if(backdrop){
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('show');
    });
  }

  // theme toggle (persisted, shared with the rest of the site)
  const themeBtn = document.getElementById('themeToggle');
  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if(isDark){
        document.documentElement.removeAttribute('data-theme');
        try{ localStorage.setItem('himam-theme', 'light'); }catch(e){}
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try{ localStorage.setItem('himam-theme', 'dark'); }catch(e){}
      }
    });
  }

  // lang switch (visual only in this dashboard preview)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // users table filter chips (visual only)
  document.querySelectorAll('#sec-users .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#sec-users .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // site pages: toggle inline quick-edit panel
  document.querySelectorAll('.page-edit-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const editor = document.getElementById(btn.dataset.target);
      if (editor) editor.classList.toggle('open');
    });
  });

  // site pages: fake-save each quick-edit form
  document.querySelectorAll('.page-editor-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.page-save-note');
      if (note) note.style.display = 'block';
    });
  });

  // publish-permission toggle updates the matrix's "conditional" cell live
  const publishToggle = document.getElementById('publishPermissionToggle');
  if(publishToggle){
    publishToggle.addEventListener('change', () => {
      const row = PERMISSIONS_MATRIX.find(r => r.label === "نشر المحتوى مباشرة");
      if(row){
        row.editor = publishToggle.checked ? "yes" : "cond";
        renderMatrix();
      }
    });
  }
});