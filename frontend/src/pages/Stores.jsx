import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Stores() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12 animate-fade-up">
        <p className="text-primary text-sm tracking-widest uppercase mb-3">наш магазин</p>
        <h1 className="section-title">магазины</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Контакты */}
        <div className="space-y-6 animate-fade-up animate-delay-100">
          <div className="card p-8">
            <h2 className="font-heading text-2xl font-light mb-6 lowercase">kiki care · тучково</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-light rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">адрес</p>
                  <p className="text-sm leading-relaxed">пл. Привокзальная, 9,<br />Тучково, Московская обл.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-light rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">телефон</p>
                  <a href="tel:+79378561466" className="text-sm hover:text-primary transition-colors">+7 (937) 856-14-66</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-light rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">email</p>
                  <a href="mailto:info@kikicare.ru" className="text-sm hover:text-primary transition-colors">info@kikicare.ru</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-light rounded-xl flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">режим работы</p>
                  <p className="text-sm">пн–пт: 10:00 – 20:00</p>
                  <p className="text-sm">сб–вс: 11:00 – 19:00</p>
                </div>
              </div>

              {/* ВКонтакте */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-light rounded-xl flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.677-1.253.677-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.745-.576.745z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">вконтакте</p>
                  <a href="https://vk.com/kikicare" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">vk.com/kikicare</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Карта */}
        <div className="animate-fade-up animate-delay-200">
          <div className="card overflow-hidden h-full min-h-[400px]">
            <iframe
              title="Kiki Care на карте"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2263.123!2d36.0!3d55.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46ca99fa84324c43%3A0x60491c419809adb9!2z0L_Qu9C4LiDQn9GA0LjQstC-0LfQutCw0LvRjNC90LDRjywgOSwg0KLRg9GH0LrQvtCy0L4!5e0!3m2!1sru!2sru!4v1620000000000!5m2!1sru!2sru"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  )
}