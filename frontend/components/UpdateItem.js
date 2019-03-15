import React, {Component} from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const SINGLE_ITEM = gql`
    query SINGLE_ITEM($id: ID!) {
        item(where: {id: $id}) {
            id
            title
            description
            price
        }
    }
`

export const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $price: Int
        $description: String
    ) {
        updateItem(
            id: $id
            title: $title
            price: $price
            description: $description
        ) {
            id
            title
            description
            price
        }
    }
`

class UpdateItem extends Component {
    state = {

    }
    handleChange = (e) => {
        const {name, type, value} = e.target
        const val = type === 'number' ? parseFloat(value) : value

        this.setState({[name]: val})
    }
    updateItem = async (e, updateItem) => {
        e.preventDefault()
        console.log('updating data...')
        console.log(this.state)
        const res = await updateItem({
            variables: {
                ...this.state,
                id: this.props.id
            }
        })
        console.log('updated')
    }
    render() {
        const {id} = this.props;
        return (
            <Query query={SINGLE_ITEM} variables={{
                id
            }}>
                {({data, error, loading}) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <p>{error.message}</p>
                    if (!data.item) return <p>{`no item found for id ${this.props.id}`}</p>
                    return (
                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, {loading, error}) => (
                                <Form onSubmit={e => {
                                    this.updateItem(e, updateItem)
                                }}>
                                    <Error error={error} />
                                    <h2>Sell an Item</h2>
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor="title">
                                            Title
                                            <input
                                                type="text" id="title"
                                                name="title" placeholder="title"
                                                defaultValue={data.item.title}
                                                required
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="price">
                                            Price
                                            <input type="number" id="price"
                                                name="price" placeholder="price"
                                                defaultValue={data.item.price} required
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="description">
                                            Description
                                            <textarea id="description"
                                                name="description" defaultValue={data.item.description}
                                                placeholder="Enter a description" required
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <button type="submit">Sav{loading ? 'ing': 'e'} Changes</button>
                                    </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    )
                }}
            </Query>
        )
    }
}

export default UpdateItem