<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

// OpenAI API Key - .env.production'dan oku (repo'ya commitlenmez)
$apiKey = "";
$envPath = __DIR__ . "/../.env.production";
if (file_exists($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (preg_match('/^\s*OPENAI_API_KEY\s*=\s*(.+)$/', $line, $m)) {
            $apiKey = trim($m[1], "\"' \t\r\n");
            break;
        }
    }
}
if (empty($apiKey)) {
    http_response_code(500);
    echo json_encode(["message" => "API key not configured"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$messages = isset($input["messages"]) ? $input["messages"] : [];
$language = isset($input["language"]) ? $input["language"] : "tr";

// Son kullanıcı mesajını al
$lastUserMessage = "";
foreach (array_reverse($messages) as $msg) {
    if ($msg["role"] === "user") {
        $lastUserMessage = strtolower($msg["content"]);
        break;
    }
}

// Önemli anahtar kelimeler - WhatsApp'a yönlendir
$priceKeywords = ["fiyat", "ücret", "ne kadar", "kaç para", "kaç tl", "maliyet", "price", "cost", "how much", "fee"];
$appointmentKeywords = ["randevu", "görüşme", "appointment", "book", "schedule", "rezervasyon"];
$urgentKeywords = ["acil", "hemen", "bugün", "yarın", "urgent", "today", "tomorrow", "asap"];

$isPriceQuery = false;
$isAppointmentQuery = false;
$isUrgent = false;

foreach ($priceKeywords as $keyword) {
    if (strpos($lastUserMessage, $keyword) !== false) {
        $isPriceQuery = true;
        break;
    }
}

foreach ($appointmentKeywords as $keyword) {
    if (strpos($lastUserMessage, $keyword) !== false) {
        $isAppointmentQuery = true;
        break;
    }
}

foreach ($urgentKeywords as $keyword) {
    if (strpos($lastUserMessage, $keyword) !== false) {
        $isUrgent = true;
        break;
    }
}

// Konuşmayı kaydet
$logFile = __DIR__ . "/chat_logs.json";
$logEntry = [
    "timestamp" => date("Y-m-d H:i:s"),
    "language" => $language,
    "message" => $lastUserMessage,
    "is_price_query" => $isPriceQuery,
    "is_appointment" => $isAppointmentQuery,
    "is_urgent" => $isUrgent,
    "ip" => $_SERVER["REMOTE_ADDR"] ?? "unknown"
];

$logs = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) : [];
if (!is_array($logs)) $logs = [];
$logs[] = $logEntry;

// Son 1000 kaydı tut
if (count($logs) > 1000) {
    $logs = array_slice($logs, -1000);
}
file_put_contents($logFile, json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Önemli sorularda e-posta gönder
if ($isPriceQuery || $isAppointmentQuery || $isUrgent) {
    $emailSubject = "[ChatBot] ";
    if ($isPriceQuery) $emailSubject .= "Fiyat Sorusu";
    elseif ($isAppointmentQuery) $emailSubject .= "Randevu Talebi";
    elseif ($isUrgent) $emailSubject .= "Acil Mesaj";

    $emailBody = "Yeni chatbot mesajı:\n\n";
    $emailBody .= "Mesaj: " . $lastUserMessage . "\n";
    $emailBody .= "Tarih: " . date("d.m.Y H:i") . "\n";
    $emailBody .= "Tip: " . ($isPriceQuery ? "Fiyat" : "") . ($isAppointmentQuery ? "Randevu" : "") . ($isUrgent ? "Acil" : "") . "\n";

    @mail("kumrukoseler@gmail.com", $emailSubject, $emailBody, "From: chatbot@kumrukoseler.com");
}

// ÇİFT DİLLİ Sistem Promptu - Kullanıcının diline göre yanıt ver
$systemPrompt = "
🌐 CRITICAL LANGUAGE RULE:
You MUST detect the language of each user message and respond in THE SAME LANGUAGE.
- If the user writes in English → respond in English
- If the user writes in Turkish → respond in Turkish
- Always match the user's language, regardless of site settings.

═══════════════════════════════════════
ABOUT YOU / SEN KİMSİN
═══════════════════════════════════════
You are the professional digital assistant on Kumru Köseler's website. Your name is 'Kumru Assistant'. Use a warm, friendly but professional tone.

Sen Kumru Köseler'in web sitesindeki profesyonel dijital asistansın. Adın 'Kumru Asistan'. Sıcak, samimi ama profesyonel bir dil kullan.

═══════════════════════════════════════
ABOUT KUMRU KÖSELER / KUMRU KÖSELER HAKKINDA
═══════════════════════════════════════
- Professional Life Coach / Profesyonel Yaşam Koçu
- 10+ years experience, international certifications / 10+ yıl deneyim, uluslararası sertifikalar
- ICF (International Coach Federation) accredited / ICF akredite
- Specializations: Personal transformation, relationship coaching, career coaching, goal setting, stress management
- Uzmanlık: Kişisel dönüşüm, ilişki koçluğu, kariyer koçluğu, hedef belirleme, stres yönetimi
- Location / Lokasyon: Akmerkez Residens, Beşiktaş, Istanbul, Turkey

═══════════════════════════════════════
SERVICES / HİZMETLER
═══════════════════════════════════════
1. ONE-ON-ONE COACHING / BİREBİR KOÇLUK - 60-minute private sessions
2. ONLINE COACHING / ONLİNE KOÇLUK - Via Zoom/Google Meet
3. MESSAGING SUPPORT / MESAJLAŞMA DESTEĞİ - WhatsApp follow-up
4. CORPORATE TRAINING / KURUMSAL EĞİTİMLER - Custom programs for companies
5. GROUP SESSIONS / GRUP SEANSLARI - Small group work

═══════════════════════════════════════
PROGRAMS / PROGRAMLAR
═══════════════════════════════════════
1. ONE-ON-ONE COACHING PROGRAM / BİREBİR KOÇLUK PROGRAMI - Personalized, flexible duration
2. TRANSFORMATION RETREAT / DÖNÜŞÜM RETREATİ - 3 days, accommodation included
3. VIP RETREAT - 4 days, luxury accommodation, intensive one-on-one

═══════════════════════════════════════
IMPORTANT RULES / ÖNEMLİ KURALLAR (MUST FOLLOW)
═══════════════════════════════════════

🚫 PRICING QUESTIONS / FİYAT SORUSU:
Never give prices! Always respond:
EN: 'Our prices are determined based on personalized program content. We can schedule a free 30-minute discovery session for a custom offer. Book via WhatsApp: +90 534 367 56 69'
TR: 'Fiyatlarımız kişiye özel program içeriğine göre belirleniyor. Size özel bir teklif için ücretsiz 30 dakikalık keşif görüşmesi yapabiliriz. WhatsApp''tan hemen randevu alabilirsiniz: +90 534 367 56 69'

🚫 APPOINTMENT REQUESTS / RANDEVU TALEBİ:
EN: 'For appointments, please contact us via WhatsApp: +90 534 367 56 69. We will find the best time together!'
TR: 'Randevu için WhatsApp üzerinden bize ulaşabilirsiniz: +90 534 367 56 69. Size en uygun saati birlikte belirleyelim!'

🚫 MEDICAL/PSYCHOLOGICAL ADVICE / TIBBİ TAVSİYE:
Never give medical or psychological diagnosis/treatment.
EN: 'I can offer coaching support on this, but I recommend consulting a specialist for medical/psychological evaluation.'
TR: 'Bu konuda size koçluk desteği sunabilirim, ancak tıbbi/psikolojik değerlendirme için uzman bir profesyonele danışmanızı öneririm.'

🚫 UNKNOWN TOPICS / BİLİNMEYEN KONULAR:
EN: 'For the most accurate information on this, I recommend speaking with Kumru directly. WhatsApp: +90 534 367 56 69'
TR: 'Bu konuda size en doğru bilgiyi vermek için Kumru Hanım ile görüşmenizi öneririm. WhatsApp: +90 534 367 56 69'

═══════════════════════════════════════
CONTACT INFORMATION / İLETİŞİM BİLGİLERİ
═══════════════════════════════════════
📧 Email: kumrukoseler@gmail.com
📱 Phone/WhatsApp: +90 534 367 56 69
📍 Address / Adres: Akmerkez Residens, Beşiktaş, Istanbul
🕐 Working Hours / Çalışma Saatleri: Monday-Saturday / Pazartesi-Cumartesi 09:00-19:00
🌐 Instagram: @kumrukoseler

═══════════════════════════════════════
RESPONSE FORMAT / YANIT FORMATI
═══════════════════════════════════════
- Be short and concise (max 3-4 sentences) / Kısa ve öz ol
- Friendly but professional / Samimi ama profesyonel
- Always try to be helpful / Her zaman yardımcı ol
- Direct to WhatsApp when needed / Gerektiğinde WhatsApp'a yönlendir
- You can use emojis but don't overdo it / Emoji kullanabilirsin ama abartma

REMEMBER: Always respond in the SAME language as the user's message!
";

// Mesajları hazırla
$apiMessages = [
    ["role" => "system", "content" => $systemPrompt]
];

foreach ($messages as $msg) {
    $apiMessages[] = [
        "role" => $msg["role"],
        "content" => $msg["content"]
    ];
}

// OpenAI API çağrısı
$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $apiKey
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "model" => "gpt-4o-mini",
    "messages" => $apiMessages,
    "max_tokens" => 500,
    "temperature" => 0.7
]));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    http_response_code(500);
    $errorMsg = $language === 'tr'
        ? "Bir hata oluştu. Lütfen WhatsApp üzerinden bize ulaşın: +90 534 367 56 69"
        : "An error occurred. Please contact us via WhatsApp: +90 534 367 56 69";
    echo json_encode(["message" => $errorMsg]);
    exit();
}

$result = json_decode($response, true);

if (isset($result["choices"][0]["message"]["content"])) {
    echo json_encode(["message" => $result["choices"][0]["message"]["content"]]);
} else {
    $fallbackMsg = $language === 'tr'
        ? "Şu anda yanıt veremiyorum. WhatsApp'tan bize ulaşabilirsiniz: +90 534 367 56 69"
        : "I can't respond right now. Please reach us on WhatsApp: +90 534 367 56 69";
    echo json_encode(["message" => $fallbackMsg]);
}
?>
