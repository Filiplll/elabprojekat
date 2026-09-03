<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>{{ $title }}</h2>
    <p>{{ $body }}</p>

    @if(!empty($details))
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            @foreach($details as $label => $value)
                <tr>
                    <td style="border: 1px solid #ddd; padding: 12px;"><strong>{{ $label }}</strong></td>
                    <td style="border: 1px solid #ddd; padding: 12px;">{{ $value }}</td>
                </tr>
            @endforeach
        </table>
    @endif

    <p style="margin-top: 30px;">Pozdrav,<br><strong>Iznajmljivanje sportskih terena</strong></p>
</body>
</html>
