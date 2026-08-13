/* =========================================================
   AMIT — AUTH + CONTACT FORM (Supabase)
   -------------------------------------------------------
   Requires: supabase-config.js loaded before this file,
   and a "messages" table in Supabase for the contact form:

   create table messages (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     email text not null,
     subject text not null,
     message text not null,
     created_at timestamp with time zone default now()
   );

   Enable Row Level Security, then add a policy that allows
   public INSERT (so the contact form works for signed-out
   visitors too):

   alter table messages enable row level security;
   create policy "Anyone can send a message"
     on messages for insert
     to anon
     with check (true);

   For GitHub login: in your Supabase dashboard go to
   Authentication -> Providers -> GitHub, enable it, and
   paste the Client ID / Secret from a GitHub OAuth App
   (github.com/settings/developers). Set the GitHub OAuth
   App's callback URL to the one Supabase shows you there.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const authOverlay = document.getElementById('authOverlay');
  const authModal = document.getElementById('authModal');
  const openAuthBtn = document.getElementById('openAuthBtn');
  const authClose = document.getElementById('authClose');
  const authArea = document.getElementById('authArea');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const authTabs = document.querySelectorAll('.auth-tab');
  const loginStatus = document.getElementById('loginStatus');
  const signupStatus = document.getElementById('signupStatus');
  const githubLoginBtn = document.getElementById('githubLoginBtn');

  /* ---------- MODAL OPEN / CLOSE ---------- */
  function openModal() { authOverlay.classList.add('open'); }
  function closeModal() { authOverlay.classList.remove('open'); }

  openAuthBtn?.addEventListener('click', openModal);
  authClose.addEventListener('click', closeModal);
  authOverlay.addEventListener('click', e => { if (e.target === authOverlay) closeModal(); });

  /* ---------- TABS ---------- */
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const isLogin = tab.dataset.tab === 'login';
      loginForm.style.display = isLogin ? 'block' : 'none';
      signupForm.style.display = isLogin ? 'none' : 'block';
    });
  });

  /* ---------- SIGN UP ---------- */
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupStatus.textContent = 'Creating your account...';
    signupStatus.className = 'auth-status';

    const name = document.getElementById('su-name').value.trim();
    const email = document.getElementById('su-email').value.trim();
    const password = document.getElementById('su-password').value;

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });

    if (error) {
      signupStatus.textContent = error.message;
      signupStatus.className = 'auth-status err';
      return;
    }

    signupStatus.textContent = 'Account created! Check your email to confirm, then log in.';
    signupStatus.className = 'auth-status ok';
    signupForm.reset();
  });

  /* ---------- LOG IN ---------- */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginStatus.textContent = 'Logging in...';
    loginStatus.className = 'auth-status';

    const email = document.getElementById('li-email').value.trim();
    const password = document.getElementById('li-password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      loginStatus.textContent = error.message;
      loginStatus.className = 'auth-status err';
      return;
    }

    loginStatus.textContent = 'Logged in!';
    loginStatus.className = 'auth-status ok';
    setTimeout(closeModal, 700);
  });

  /* ---------- GITHUB OAUTH ---------- */
  githubLoginBtn.addEventListener('click', async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.href }
    });
    if (error) alert('GitHub sign-in error: ' + error.message);
  });

  /* ---------- SESSION STATE -> NAVBAR UI ---------- */
  function renderAuthArea(session) {
    if (session?.user) {
      const user = session.user;
      const label = user.user_metadata?.full_name || user.email;
      const initial = label.charAt(0).toUpperCase();
      authArea.innerHTML = `
        <div class="user-chip">
          <span class="avatar">${initial}</span>
          <span>${label}</span>
          <button class="btn btn-ghost btn-sm" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i></button>
        </div>`;
      document.getElementById('logoutBtn').addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
      });
    } else {
      authArea.innerHTML = `<button class="btn btn-ghost" id="openAuthBtn"><i class="fa-solid fa-user"></i> Sign in</button>`;
      document.getElementById('openAuthBtn').addEventListener('click', openModal);
    }
  }

  // initial session check
  supabaseClient.auth.getSession().then(({ data }) => renderAuthArea(data.session));

  // keep UI in sync on login/logout/token refresh
  supabaseClient.auth.onAuthStateChange((_event, session) => renderAuthArea(session));

  /* ---------- CONTACT FORM -> SUPABASE ---------- */
  const contactForm = document.getElementById('contactForm');
  const cfSubmit = document.getElementById('cfSubmit');
  const cfStatus = document.getElementById('cfStatus');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    cfSubmit.classList.add('loading');
    cfSubmit.disabled = true;
    cfStatus.textContent = '';
    cfStatus.className = 'form-status';

    const payload = {
      name: document.getElementById('cf-name').value.trim(),
      email: document.getElementById('cf-email').value.trim(),
      subject: document.getElementById('cf-subject').value.trim(),
      message: document.getElementById('cf-message').value.trim()
    };

    const { error } = await supabaseClient.from('messages').insert([payload]);

    cfSubmit.classList.remove('loading');
    cfSubmit.disabled = false;

    if (error) {
      cfStatus.textContent = 'Could not send — please try again or email me directly.';
      cfStatus.className = 'form-status err';
      console.error(error);
      return;
    }

    cfStatus.textContent = "Thanks! Your message has been sent — I'll reply soon.";
    cfStatus.className = 'form-status ok';
    contactForm.reset();
  });

});
