import { useState, useEffect } from 'react'
import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { db } from './data/db'


function App() { // Los componentes siempre empiezan con mayusculas

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  } // Si localStorageCart tiene algo lo transforma en array y despues lo retona, si no tiene nada retorna un array vacio

  // State
  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const MIN_ITEMS = 1
  const MAX_ITEMS = 5
  
  useEffect(() => { // useEffect es muy útil para los efectos secundarios cuando nuestro State cambia
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart]) // useEffect se ejecuta automaticamente cada que 'cart' cambia

  // Añadir un item al carrito
  function addToCart(item) {
    const itemExist = cart.findIndex(guitar => guitar.id === item.id) // Si no existe el elemento retorna -1, en caso de que exista retorna la posición del id en el array
    if(itemExist >= 0) { // Existe el elemento en el array
      if(cart[itemExist].quantity >= MAX_ITEMS) return // Si el usuario intenta agregar al carrito más de la cantidad permitida se retona automaticamente
      const updatedCart = [...cart] // Copiamos el carrito actual
      updatedCart[itemExist].quantity++ // Aumentamos la cantidad de la copia del carrito
      setCart(updatedCart) // Seteamos el carrito
    } else { // No existe el elemento en el array
      item.quantity = 1
      setCart([...cart, item]) // Se genera un nuevo arreglo con los anteriores elementos de prevCart y como ultimo elemento se agrega el item
    }
    
  }

  // Eliminar un item del carrito
  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id)) // Crea un nuevo arreglo, filtrando por el id de las guitarras que NO se desean eliminar
  }


  // Aumentar la cantidad de items 
  function increaseQuantity(id) {
    const updatedCart = cart.map(item => { // Con .map iteramos el array, creando uno nuevo en updatedCart y agregando ahí los items del carrito
      if(item.id === id && item.quantity < MAX_ITEMS) { // Identificar el elemento
        return {
          ...item, // Retornar una copia del elemento que conicide
          quantity: item.quantity + 1 // Aumentar la cantidad y retornarla
        }
      }
      return item // Mantener el resto de items igual
    })
    setCart(updatedCart)
  }

  // Disminuir la cantidad de items 
  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => { // Con .map iteramos el array, creando uno nuevo en updatedCart y agregando ahí los items del carrito
      if(item.id === id && item.quantity > MIN_ITEMS) { // Identificar el elemento
        return {
          ...item, // Retornar una copia del elemento que conicide
          quantity: item.quantity - 1 // Disminuir la cantidad y retornarla
        }
      }
      return item // Mantener el resto de items igual
    })
    setCart(updatedCart)
  }

  // Limpiar carrito
  function clearCart() {
    setCart([]) // Se limpia el carrito
  }

 

  return (
    <>
    <Header 
      cart={cart}
      removeFromCart={removeFromCart}
      increaseQuantity={increaseQuantity}
      decreaseQuantity={decreaseQuantity}
      clearCart={clearCart}
    /> {/* Se importa el componente Header */}
    

    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
            {data.map((guitar) => ( // Cuando se itera con ".map" siempre se debe utilizar el prop de "key", este siempre debe tener un valor unico
              <Guitar 
                key={guitar.id}
                guitar={guitar}
                addToCart={addToCart}
              />  
            ))} 
            
        </div>
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>   
    </>
  )
}

export default App
