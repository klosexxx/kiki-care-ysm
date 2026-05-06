import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="font-heading text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-heading text-2xl font-bold mb-3">Страница не найдена</h2>
        <p className="text-gray-400 mb-8">Возможно она была удалена или вы ввели неверный адрес</p>
        <Link to="/" className="btn-primary">На главную</Link>
      </div>
    </div>
  )
}