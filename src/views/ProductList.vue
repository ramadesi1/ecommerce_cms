<template>
  <div class="card">
    <div class="card-header">
      Products
    </div>
    <div class="card-body">
      <button class="btn btn-primary" @click="addProduct">Add Product</button>
      <br>
      <br>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">Image</th>
            <th scope="col">Price</th>
            <th scope="col">Stock</th>
            <th scope="col">Category</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in $store.state.products" :key="product.id">
            <td>{{ index + 1 }}</td>
            <td>{{ product.name }}</td>
            <td><img height="100" width="100" :src="product.img_url"></td>
            <td>{{ product.price }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.Category.name }}</td>
            <td>
              <button class="btn btn-primary" @click="editProduct(product.id)">Edit</button> |
              <button class="btn btn-danger" @click="deleteProduct(product.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <loading :active.sync="isLoading"
        :can-cancel="true"
        :is-full-page="true"></loading>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
export default {
  name: 'ProductList',
  components: {
    Loading
  },
  data () {
    return {
      isLoading: false
    }
  },
  created () {
    this.$store.dispatch('getProducts')
  },
  methods: {
    addProduct () {
      this.$router.push('/dashboard/addproduct')
    },
    editProduct (id) {
      this.$router.push(`/dashboard/editproduct/${id}`)
    },
    deleteProduct (id) {
      this.isLoading = true
      this.$store.dispatch('deleteProduct', id)
        .then(result => {
          this.isLoading = false
          const status = {
            title: 'Product Deleted!',
            body: 'Pdoruct successfully deleted.',
            type: 'success',
            canTimeout: true,
            duration: 2000
          }
          this.$vToastify.success(status)
        })
        .catch(err => {
          this.isLoading = false
          const status = {
            title: 'Failed!',
            body: err.response.data.errors[0],
            type: 'error',
            canTimeout: true,
            duration: 2000
          }
          this.$vToastify.error(status)
        })
    }
  }
}
</script>
