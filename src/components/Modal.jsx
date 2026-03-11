export default function Modal({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,10,0,0.65)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fffdf8',
          borderRadius: 24,
          width: '100%', maxWidth: 560,
          maxHeight: '92vh', overflowY: 'auto',
          padding: '28px 28px 32px',
          boxShadow: '0 32px 100px rgba(0,0,0,0.3)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
