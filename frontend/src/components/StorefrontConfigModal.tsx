import './StorefrontConfigModal.css'

type StorefrontConfigModalProps = {
  onClose: () => void
}

function StorefrontConfigModal({ onClose }: StorefrontConfigModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="storefront-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="storefront-modal-title">Storefront URL not configured</h2>
        <p>
          Add your shop frontend URL to the environment file so shoppers can be
          redirected when they click <strong>Start shopping</strong>.
        </p>
        <ol className="modal-steps">
          <li>
            Create or edit <code>frontend/.env</code>
          </li>
          <li>
            Add <code>VITE_STOREFRONT_URL=https://your-shop.example.com</code>
          </li>
          <li>Restart the frontend dev server</li>
        </ol>
        <button type="button" className="button button--primary" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  )
}

export default StorefrontConfigModal
