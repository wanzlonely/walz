export const CONFIG = {
    botToken: '8182701764:AAFZnFZQwn4aAV3Gowh5eGZ43ogG2V4swJk',
    ownerId: '7650101390',
    groupId: '-1003675929763',
    groupLink: 'https://t.me/stockwalzyy',
    botImage: 'https://files.catbox.moe/kjfe0d.jpg',
    dbPath: './database',
    batchSize: 50,
    maxEmails: 20,
    maxCountPerEmail: 15,
    scriptLink: 'https://t.me/walzyexploit',
    vercelUrl: 'https://email-api-walzy.vercel.app/api/send'
};

export const APPEAL_TEXTS = {
    fixred: [
        {
            subject: "Login Indisponível",
            body: "Prezada Equipe de Suporte do WhatsApp, Estou com problemas para registrar meu número. Sempre que tento, recebo a mensagem \"login indisponível\". Este número é muito importante porque o utilizo para fins educacionais e de comunicação como estudante. Espero sinceramente que a equipe do WhatsApp possa ajudar a resolver este problema o mais rápido possível para que eu possa usá-lo novamente no WhatsApp. Meu número é {nomor} Agradeço a atenção e o apoio de todos."
        },
        {
            subject: "Verification Problem",
            body: "Hello WhatsApp, I am having problems with number verification. The problem is that it says the number is not available, even though I just bought it, please re-verify my WhatsApp number which is affected by the issue because the number is very important {nomor}, I hope this problem can be resolved soon, thank you."
        }
    ],
    spam: [
        {
            subject: "Peninjauan Kembali Pemblokiran Akun",
            body: "Yth. Tim Dukungan WhatsApp, saya menulis ini untuk mengajukan banding atas pemblokiran nomor saya {nomor} yang dianggap melakukan spam. Saya meyakini adanya kesalahan pada sistem deteksi otomatis Anda. Nomor ini saya gunakan secara eksklusif untuk komunikasi bisnis yang sah dengan klien yang telah memberikan persetujuan untuk dihubungi. Saya selalu mematuhi pedoman komunitas dan tidak pernah mengirim pesan massal yang tidak diinginkan. Mohon tinjau aktivitas akun saya secara manual dan pulihkan akses saya sesegera mungkin."
        }
    ],
    permanen: [
        {
            subject: "Permohonan Maaf dan Peninjauan Kembali Blokir Permanen",
            body: "Yth. Tim Keamanan WhatsApp, saya menyadari bahwa nomor saya {nomor} telah diblokir secara permanen. Saya ingin menyampaikan permohonan maaf yang tulus jika saya secara tidak sengaja melanggar Ketentuan Layanan. Saya mungkin kurang memahami beberapa kebijakan terbaru. Saya berjanji untuk membaca ulang semua aturan dan mematuhinya dengan ketat di masa depan. Nomor ini sangat krusial bagi kehidupan pribadi dan pekerjaan saya. Mohon berikan saya kesempatan kedua untuk menggunakan layanan ini."
        }
    ]
};
