import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div className="md:col-span-2">
          <h3 className="font-heading text-3xl font-light tracking-widest text-white mb-4">kiki care</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            корейская и европейская косметика с заботой о вашей коже. тучково, московская область.
          </p>
          <div className="flex items-center gap-3 mt-6">

            <a href="https://t.me/kikicare01" target="_blank" rel="noopener noreferrer" title="Telegram"
              className="w-9 h-9 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
              <Send size={15} />
            </a>

            <a href="https://vk.com/kikicare" target="_blank" rel="noopener noreferrer" title="ВКонтакте"
              className="w-9 h-9 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.677-1.253.677-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.57 4 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.745-.576.745z" />
              </svg>
            </a>

          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">навигация</p>
          <ul className="space-y-3">
            {[['/', 'главная'], ['/catalog', 'каталог'], ['/brands', 'бренды'], ['/stores', 'магазины']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 text-sm hover:text-white transition-colors lowercase tracking-wide">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">контакты</p>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="leading-relaxed">
              пл. Привокзальная, 9,<br />
              ТК "Золотая вертикаль", 2 этаж,<br />
              Тучково
            </li>
            <li>
              <a href="tel:+79258777838" className="hover:text-white transition-colors">
                8-925-877-78-38
              </a>
            </li>
            <li>
              <a href="mailto:info@kikicare.ru" className="hover:text-white transition-colors">
                info@kikicare.ru
              </a>
            </li>
            <li className="text-gray-500">ежедневно: 10:00 — 19:00</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-white/5 text-center py-5 text-gray-600 text-xs tracking-wider">
        © {new Date().getFullYear()} kiki care. все права защищены.
      </div>
    </footer>
  )
}