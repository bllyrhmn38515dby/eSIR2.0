from graphviz import Digraph

# Membuat diagram alur sistem rujukan online setelah penerapan UCD
dot = Digraph(comment="Alur Sistem Rujukan Online Setelah UCD")

# Node
dot.node("A", "Tenaga Medis Mengakses Aplikasi")
dot.node("B", "Login ke Sistem Rujukan Online")
dot.node("C", "Input Data Pasien\n(lebih sederhana & terstruktur)")
dot.node("D", "Pilih Rumah Sakit Tujuan\n(dengan filter lokasi/spesialisasi)")
dot.node("E", "Informasi Fasilitas Real-Time\n(Kamar, Dokter, ICU, Alat Medis)")
dot.node("F", "Validasi Otomatis Input Data")
dot.node("G", "Rujukan Dikirim")
dot.node("H", "Pelacakan Status Rujukan\n(real-time tracking)")

# Edges
dot.edges(["AB", "BC", "CD"])
dot.edge("D", "E")
dot.edge("C", "F")
dot.edge("E", "G")
dot.edge("F", "G")
dot.edge("G", "H")

# Simpan dan render sebagai file PNG
file_path = "Alur_Rujukan_Online_Setelah_UCD"
dot.render(file_path, format="png", cleanup=True)

print("Diagram berhasil dibuat:", file_path + ".png")
