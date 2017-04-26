<div style="font-family: Verdana; max-width: 1000px">
    <div style="width: 100%; background: #505050; border-top: 5px solid #1B778C">
        <h1 style="color: #f2f2f2; padding: 20px; text-transform: uppercase">herzjesu-derendingen.ch</h1>
    </div>
    <div style="padding: 30px">
        <h2 style="border-bottom: 2px solid #f2f2f2; padding-bottom: 30px;">
            {{ $prename  }} {{ $surname  }} möchte wegen '{{ $concern }}' mit Ihnen Kontakt aufnehmen
        </h2>
        <h3 style="padding: 20px 0 10px 0;">Persönliche Angaben</h3>
        <table>
            <tr>
                <td>Vorname</td>
                <td style="padding-left: 20px">{{ $prename }}</td>
            </tr>
            <tr>
                <td>Nachname</td>
                <td style="padding-left: 20px">{{ $surname }}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td style="padding-left: 20px">{{ $email }}</td>
            </tr>
            <tr>
                <td>Anliegen</td>
                <td style="padding-left: 20px">{{ $concern }}</td>
            </tr>
        </table>
        <h3 style="padding: 20px 0 10px 0;">Mitteilung</h3>
        <p style="border-bottom: 2px solid #f2f2f2; padding-bottom: 30px;">{!! $msg !!}</p>

        <div style="width: 100%; text-align: center">
            <a href="mailto:{{ $email }}?subject=RE:%20herzjesu-derendingen.ch%20{{ $concern }}"
               style="display: inline-block; width: 300px; font-size: 20px; background: #1B778C; border-radius: 4px; padding: 15px; text-align: center; color: white; text-decoration: none;">
                {{ $prename }} Antworten
            </a>
        </div>
    </div>
</div>