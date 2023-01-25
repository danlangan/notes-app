import { Form, Stack, Row, Col, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap"
import CreatableReactSelect from 'react-select'
import { Link } from 'react-router-dom'
import { FormEvent, useRef, useState } from "react"
import { NoteData, Tag } from "./App"

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
}

export function NoteForm({ onSubmit }: NoteFormProps ) {
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: []
        })
    }

    return (
    <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                <FormGroup controlId='title'>
                    <FormLabel>Title</FormLabel>
                    <FormControl required ref={titleRef}/>
                </FormGroup>
                </Col>
                <Col>
                <FormGroup controlId='tags'>
                    <FormLabel>Tags</FormLabel>
                    <CreatableReactSelect value={selectedTags.map(tag => {
                        return { label: tag.label, value: tag.id }
                    })}
                    onChange={tags => {
                        setSelectedTags(tags.map(tag => {
                            return { label: tag.label, id: tag.value }
                        }))
                    }}
                    isMulti/>
                </FormGroup>
                </Col>
            </Row>
            <FormGroup controlId='markdown'>
                <FormLabel>Body</FormLabel>
                <FormControl required as='textarea' ref={markdownRef} rows={15}/>
            </FormGroup>
            <Stack direction='horizontal' gap={2} className='justify-content-end'>
                <Button type="submit" variant='primary'>Save</Button>
                <Link to='..'>
                <Button type="button" variant='outline-secondary'>Cancel</Button>
                </Link>
            </Stack>
        </Stack>
    </Form>
    )
}