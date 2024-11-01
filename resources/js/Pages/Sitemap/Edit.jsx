import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Layout from "@/Layouts/Index";

import { Button, Card, Col, Form, Image, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import CKEditor from "@/Containers/CKEditor";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

function Edit({ sitemap, crumbs }) {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState("");
    const [staticPage, setStaticPage] = useState(null);
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState(0);
    const [created, setCreated] = useState("");
    const [updated, setUpdated] = useState("");

    const handleBack = () => {
        router.visit("/admin/sitemap", {
            method: "get",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(content);
        
        window.axios
            .put("/admin/sitemap/" + sitemap?.id, {
                page: page,
                content: content,
                url: url,
                status: status,
                static_page: staticPage,
            })
            .then((res) => {
                if (res.data.check == true) {
                    toast.success(res.data.message);
                    router.visit("/admin/services/" + service?.id, {
                        method: "get",
                    });
                } else {
                    toast.warning(res.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            })
            .finally(() => setLoading(false));
    };

    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const handleEditorBlur = (data) => {
        setContent(data);
    };

    useEffect(() => {
        setPage(sitemap.page)
        setStaticPage(sitemap.static_page)
        setContent(sitemap.content)
        setUrl(sitemap.url)
        setStatus(sitemap.status)
        setCreated(sitemap.created_at)
        setUpdated(sitemap.updated_at)
    }, [sitemap]);

    return (
        <>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button variant="secondary" onClick={handleBack}>
                                <i className="bi bi-box-arrow-right" />
                                <span className="ms-2">Quay lại</span>
                            </Button>
                            <Button className="ms-2" variant="success" type="submit" disabled={loading} onClick={handleSubmit}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" animation="border" variant="secondary" />
                                        <span>Đang lưu...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-floppy-fill" />
                                        <span className="ms-2">Lưu cập nhật</span>
                                    </>
                                )}
                            </Button>
                        </BreadcrumbComponent>
                        {/* Start DataGrid */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Chi tiết trang </h4>
                                </div>
                                <Form encType="multipart/form-data">
                                    <Row>
                                        <Col className="d-flex flex-column">
                                            <Card className="p-3">
                                                {/* Tên Trang */}
                                                <Form.Group className="mb-3" controlId="name">
                                                    <Form.Label>Nhập tên trang</Form.Label>
                                                    <Form.Control type="text" placeholder="Tên sản phẩm..." value={page} onChange={(e) => setPage(e.target.value)} />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="name">
                                                    <Form.Label>Nhập đường dẫn cho trang</Form.Label>
                                                    <Form.Control type="text" placeholder="Tên sản phẩm..." value={url} onChange={(e) => setUrl(e.target.value)} />
                                                </Form.Group>
                                                <Row className="row-cols-9">
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="status">
                                                            <Form.Label>Trạng thái</Form.Label>
                                                            <Form.Check
                                                                className="my-auto"
                                                                checked={status === 1}
                                                                type="switch"
                                                                id="status"
                                                                label={status === 1 ? "Hoạt động" : "Tạm ngừng"}
                                                                onChange={() => setStatus(status === 1 ? 0 : 1)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="staticPage">
                                                            <Form.Label>Loại trang</Form.Label>
                                                            <Form.Select
                                                                value={staticPage}
                                                                onChange={(e) => setStaticPage(parseInt(e.target.value))}
                                                            >
                                                                <option value={1}>Trang tĩnh</option>
                                                                <option value={0}>Trang link</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Row className="row-cols-12">
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="name">
                                                            <Form.Label>Ngày tạo</Form.Label>
                                                            <Form.Control type="text" value={formatCreatedAt(created)} disabled />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group className="mb-3" controlId="name">
                                                            <Form.Label>Ngày cập nhật</Form.Label>
                                                            <Form.Control type="text" value={formatCreatedAt(updated)} disabled />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                {/* Nội dung chính */}
                                                <Form.Group controlId="name">
                                                    <Form.Label>Nội dung chính</Form.Label>
                                                    <CKEditor value={content} onBlur={handleEditorBlur} />
                                                </Form.Group>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Form>
                            </Box>
                        </Col>
                        {/* End DataGrid */}
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Edit;