from graphviz import Digraph

# Membuat diagram alur sistem rujukan online eksisting (sebelum UCD)
dot = Digraph(comment="Alur Sistem Rujukan Online Eksisting")

# Node
dot.node("A", "Tenaga Medis Mengakses Aplikasi")
dot.node("B", "Login ke Sistem Rujukan Online")
dot.node("C", "Input Data Pasien (Identitas, Diagnosis, dll)")
dot.node("D", "Cari Rumah Sakit Tujuan")
dot.node("E", "Informasi Fasilitas (Kamar, Dokter, ICU)")
dot.node("F", "Data Tidak Real-Time\n(Ketersediaan sering tidak akurat)")
dot.node("G", "Rujukan Dikirim")
dot.node("H", "Potensi Masalah:\n- RS penuh\n- Kesalahan input\n- Rujukan ulang")

# Edges
dot.edges(["AB", "BC", "CD"])
dot.edge("D", "E")
dot.edge("E", "F")
dot.edge("F", "G")
dot.edge("G", "H")

# Simpan dan render sebagai file PNG
file_path = "Alur_Rujukan_Online_Eksisting"
dot.render(file_path, format="png", cleanup=True)

print("Diagram berhasil dibuat:", file_path + ".png")
