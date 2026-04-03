insert into public.site_settings (key, value_json)
values (
  'homepage_widget_content',
  '{
    "heroIntro": {
      "badge": "David Kozák International, s.r.o.",
      "titleLead": "Druhou šanci si zaslouží",
      "titleAccent": "každý.",
      "description": "Homepage znovu spojuje hlavní články a zpracované sekce do jednoho proudu. Zároveň zůstává zachované rozdělení do samostatných stránek a detailů v menu.",
      "mottoEyebrow": "Motto projektu",
      "mottoQuote": "\"Každý příběh má právo pokračovat.\"",
      "mottoBody": "Druhá šance není slogan do kampaně. Je to pracovní metoda, která vrací člověka zpět do vztahů, práce a důvěry.",
      "primaryCtaLabel": "PŘEJÍT NA PILÍŘE",
      "secondaryCtaLabel": "O PROJEKTU",
      "imageQuote": "\"Každý příběh má právo pokračovat.\""
    },
    "topicPages": {
      "eyebrow": "Rozdělení obsahu",
      "titleLead": "Nové stránky",
      "titleAccent": "podle tématu"
    },
    "aiAssistant": {
      "badge": "AI Integrační Asistent",
      "titleLead": "Váš plán",
      "titleAccent": "restartu",
      "description": "Napište nám o své situaci a naše AI vám navrhne první kroky podle pilířů Integrace.",
      "placeholder": "Popište svou situaci... (např. ''Právě jsem vyšel z výkonu trestu a nemám kde bydlet'')",
      "submitLabel": "Analyzovat příběh",
      "loadingLabel": "Analyzuji...",
      "resultLabel": "Navržený plán integrace"
    }
  }'::jsonb
)
on conflict (key) do nothing;
