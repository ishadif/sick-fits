import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

export const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $price: Int!
        $description: String!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            price: $price
            description: $description
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`

class CreateItem extends Component {
    state = {
        title: 'Cool Shoes',
        price: 10000,
        description: 'this is cool shoes',
        image: null,
        largeImage: null,
    }
    handleChange = (e) => {
        const {name, type, value} = e.target
        const val = type === 'number' ? parseFloat(value) : value

        this.setState({[name]: val})
    }
    uploadFile = async e => {
        console.log('uploading file...')
        const {files} = e.target
        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'sick-fits')

        const res = await fetch('https://api.cloudinary.com/v1_1/ishadi/image/upload', {
            method: 'POST',
            body: data
        })

        const file = await res.json()
        console.log(file)
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        })
    }
    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, {loading, error}) => (
                    <Form onSubmit={async e => {
                        e.preventDefault()

                        const res = await createItem()
                        Router.push({
                            pathname: '/item',
                            query: {
                                id: res.data.createItem.id
                            }
                        })
                    }}>
                        <Error error={error} />
                        <h2>Sell an Item</h2>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="file">
                                Image
                                <input
                                    type="file" id="file"
                                    name="file" placeholder="file"
                                    required
                                    onChange={this.uploadFile}
                                />
                                {this.state.image && <img width="200" src={this.state.image} alt={'upload image'} />}
                            </label>
                            <label htmlFor="title">
                                Title
                                <input
                                    type="text" id="title"
                                    name="title" placeholder="title"
                                    value={this.state.title}
                                    required
                                    onChange={this.handleChange}
                                />
                            </label>
                            <label htmlFor="price">
                                Price
                                <input type="number" id="price"
                                    name="price" placeholder="price"
                                    value={this.state.price} required
                                    onChange={this.handleChange}
                                />
                            </label>
                            <label htmlFor="description">
                                Description
                                <textarea id="description"
                                    name="description" value={this.state.description}
                                    placeholder="Enter a description" required
                                    onChange={this.handleChange}
                                />
                            </label>
                            <button type="submit">Submit</button>
                        </fieldset>
                    </Form>
                )}
            </Mutation>
        )
    }
}

export default CreateItem