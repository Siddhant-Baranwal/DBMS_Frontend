// src/components/AddItem/Error.js
export default function Error(message) {
  // ---- Timestamp ----
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // ---- Create the dialog box ----
  const div = document.createElement('div');
  div.classList.add('error-dialog');
  div.style.position = 'fixed';
  div.style.backgroundColor = '#f44336';
  div.style.color = 'white';
  div.style.padding = '20px 26px';
  div.style.borderRadius = '12px';
  div.style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)';
  div.style.zIndex = 9999;
  div.style.fontSize = '15px';
  div.style.maxWidth = '420px';
  div.style.minWidth = '300px';
  div.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  div.style.opacity = '0';
  div.style.transform = 'scale(0.9)';
  div.style.display = 'flex';
  div.style.flexDirection = 'column';
  div.style.gap = '10px';
  div.style.border = '1px solid rgba(255,255,255,0.2)';

  // ---- Random position inside viewport ----
  const margin = 40;
  const maxLeft = window.innerWidth - 440;
  const maxTop = window.innerHeight - 160;
  const randomLeft = Math.max(margin, Math.random() * maxLeft);
  const randomTop = Math.max(margin, Math.random() * maxTop);

  div.style.left = `${randomLeft}px`;
  div.style.top = `${randomTop}px`;

  // ---- Header (title + close) ----
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';

  const title = document.createElement('div');
  title.textContent = `❌ Error (${time})`;
  title.style.fontWeight = '700';
  title.style.fontSize = '17px';
  title.style.letterSpacing = '0.4px';
  title.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✖';
  closeBtn.style.background = 'transparent';
  closeBtn.style.border = 'none';
  closeBtn.style.color = 'white';
  closeBtn.style.fontSize = '18px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.onmouseenter = () => (closeBtn.style.color = '#ffcccc');
  closeBtn.onmouseleave = () => (closeBtn.style.color = 'white');
  closeBtn.onclick = () => {
    div.style.opacity = '0';
    div.style.transform = 'scale(0.9)';
    setTimeout(() => div.remove(), 400);
  };

  header.appendChild(title);
  header.appendChild(closeBtn);

  // ---- Message body ----
  const msg = document.createElement('div');
  msg.textContent = message || 'An unexpected error occurred.';
  msg.style.wordWrap = 'break-word';
  msg.style.lineHeight = '1.5';
  msg.style.fontWeight = '400';
  msg.style.fontSize = '15px';
  msg.style.background = 'rgba(255,255,255,0.1)';
  msg.style.padding = '10px 12px';
  msg.style.borderRadius = '8px';

  div.appendChild(header);
  div.appendChild(msg);
  document.body.appendChild(div);

  // ---- Animate ----
  requestAnimationFrame(() => {
    div.style.opacity = '1';
    div.style.transform = 'scale(1)';
  });

  // ---- Add Clear All Errors button if not present ----
  if (!document.getElementById('clear-errors-btn')) {
    const clearBtn = document.createElement('button');
    clearBtn.id = 'clear-errors-btn';
    clearBtn.textContent = '🧹 Clear All Errors';
    clearBtn.style.position = 'fixed';
    clearBtn.style.bottom = '25px';
    clearBtn.style.left = '25px';
    clearBtn.style.backgroundColor = '#b71c1c';
    clearBtn.style.color = 'white';
    clearBtn.style.border = 'none';
    clearBtn.style.padding = '12px 20px';
    clearBtn.style.borderRadius = '8px';
    clearBtn.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)';
    clearBtn.style.fontSize = '15px';
    clearBtn.style.cursor = 'pointer';
    clearBtn.style.transition = 'background-color 0.3s ease';
    clearBtn.onmouseenter = () => (clearBtn.style.backgroundColor = '#d32f2f');
    clearBtn.onmouseleave = () => (clearBtn.style.backgroundColor = '#b71c1c');

    clearBtn.onclick = () => {
      document.querySelectorAll('.error-dialog').forEach((dlg) => {
        dlg.style.opacity = '0';
        dlg.style.transform = 'scale(0.9)';
        setTimeout(() => dlg.remove(), 400);
      });
      clearBtn.remove();
    };

    document.body.appendChild(clearBtn);
  }
}
