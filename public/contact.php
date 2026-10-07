<?php
/**
 * Contact form endpoint — receives the site's consultation form and emails
 * it to info@deltamuscat.com. Plain PHP mail() (no dependencies), UTF-8 safe.
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'reason' => 'method']);
    exit;
}

// Honeypot: hidden field must stay empty (bots fill it).
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$clean = static function (string $key, int $max): string {
    $v = trim((string)($_POST[$key] ?? ''));
    $v = str_replace(["\r", "\n"], ' ', $v); // header-injection guard
    return mb_substr($v, 0, $max);
};

$name        = $clean('name', 100);
$phone       = $clean('phone', 30);
$from        = $clean('email', 120);
$need        = $clean('need', 80);
$projectType = $clean('projectType', 80);
$location    = $clean('location', 120);
$message     = mb_substr(trim((string)($_POST['message'] ?? '')), 0, 3000);

if ($name === '' || $phone === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'reason' => 'required']);
    exit;
}
if ($from !== '' && !filter_var($from, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'reason' => 'email']);
    exit;
}

$to      = 'info@deltamuscat.com';
$subject = '=?UTF-8?B?' . base64_encode("Consultation request — $need — $name") . '?=';
$body    = implode("\n", array_filter([
    "Name: $name",
    "Phone: $phone",
    $from !== '' ? "Email: $from" : '',
    "What do you need: $need",
    "Project type: $projectType",
    $location !== '' ? "Project location: $location" : '',
    '',
    'About the space:',
    $message,
]));
$bodyEncoded = chunk_split(base64_encode($body));

$headers = implode("\r\n", [
    'From: Delta Muscat Website <info@deltamuscat.com>',
    $from !== '' ? "Reply-To: $from" : 'Reply-To: info@deltamuscat.com',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
]);

$sent = @mail($to, $subject, $bodyEncoded, $headers);
http_response_code($sent ? 200 : 500);
echo json_encode(['ok' => (bool)$sent]);
