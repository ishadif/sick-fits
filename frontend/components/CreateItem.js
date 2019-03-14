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
        image: 'dog.jpeg',
        largeImage: 'large-dog.jpeg',
    }
    handleChange = (e) => {
        const {name, type, value} = e.target
        const val = type === 'number' ? parseFloat(value) : value

        this.setState({[name]: val})
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