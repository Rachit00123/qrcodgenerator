// script.js

async function generateQR() {
  const text = document.getElementById("qrText").value.trim();
  const fgColor = document.getElementById("fgColor").value;
  const bgColor = document.getElementById("bgColor").value;
  const designerCanvas = document.getElementById("designerQR");
  const ctx = designerCanvas.getContext("2d");

  if (!text) {
    alert("Please enter text or URL");
    return;
  }

  // Clear old QR code
  ctx.clearRect(0, 0, designerCanvas.width, designerCanvas.height);

  // Generate QR code
  await QRCode.toCanvas(designerCanvas, text, {
    width: 300,
    color: {
      dark: fgColor,
      light: bgColor
    }
  });

  // Add logo if uploaded
  const file = document.getElementById("logoUpload").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const logoSize = designerCanvas.width * 0.2;
        const x = (designerCanvas.width - logoSize) / 2;
        const y = (designerCanvas.height - logoSize) / 2;

        // Draw background behind logo
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, logoSize, logoSize);

        // Draw logo
        ctx.drawImage(img, x, y, logoSize, logoSize);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function downloadQR(canvasId, type) {
  const canvas = document.getElementById(canvasId);
  const text = document.getElementById("qrText").value;

  if (type === 'png') {
    const link = document.createElement('a');
    link.download = canvasId + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } else if (type === 'svg') {
    QRCode.toString(text, {
      type: 'svg',
      color: {
        dark: document.getElementById("fgColor").value,
        light: document.getElementById("bgColor").value
      }
    }, function (err, string) {
      if (!err) {
        const blob = new Blob([string], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = canvasId + '.svg';
        link.click();
      }
    });
  }
}
