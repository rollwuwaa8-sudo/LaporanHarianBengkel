const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-c3TRGQhEOpCTLdGDUURQOF10PsK9IhLYpi5_iZ27_R9hIGMwNGoy6yLQBZnOohJx/exec';

async function fetchLaporan() {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';
    
    try {
        const response = await fetch(APPS_SCRIPT_URL);
        const data = await response.json();
        
        document.getElementById('jumlah-servis').innerText = data.jumlahServis;
        document.getElementById('total-biaya').innerText = 'Rp ' + data.totalBiaya.toLocaleString('id-ID');

        const tbody = document.querySelector('#parts-table tbody');
        tbody.innerHTML = data.sukuCadang.map(item => `
            <tr>
                <td><small>${item.tanggal}</small></td>
                <td><strong>${item.nama}</strong></td>
                <td>${item.qty}</td>
                <td>${Number(item.harga).toLocaleString('id-ID')}</td>
            </tr>
        `).join('');
    } catch (e) {
        console.error("Gagal memuat data", e);
    }
    loading.style.display = 'none';
}

document.getElementById('input-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-simpan');
    
    const data = {
        nama: document.getElementById('nama-barang').value,
        qty: document.getElementById('qty').value,
        harga: document.getElementById('harga').value
    };

    btn.disabled = true;
    btn.innerText = 'Menyimpan...';

    try {
        await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        document.getElementById('input-form').reset();
        await fetchLaporan(); // Update tampilan setelah simpan
    } catch (err) {
        alert('Gagal menyimpan data ke Sheets');
    } finally {
        btn.disabled = false;
        btn.innerText = 'Simpan Data';
    }
});

// Jalankan saat halaman dibuka
fetchLaporan();
