const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
  constructor() {
    // Eliminamos category y path del constructor porque ya no se usan
    this.baseUrl = "http://wdd330-backend.onrender.com"
  }

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

   // Nuevo método para enviar órdenes
  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(`${this.baseUrl}/checkout`, options);
      return await response.json();
    } catch (err) {
      console.error(err);
      return { error: err.message };
    }
  }
  async checkout(orderData) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        };

        const response = await fetch(`${this.baseUrl}/checkout`, options);
        return await response.json();
    }
}


