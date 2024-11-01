import React, { useEffect, useMemo, useState } from "react";
import { Box, FormControlLabel, Select, Switch } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Layout from "@/Layouts/Index";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { FormControl, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import CKEditor from "@/Containers/CKEditor";
import BreadcrumbComponent from "@/Components/BreadcrumbComponent";
import { Helmet } from "react-helmet";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

function Index({ sitemap, crumbs }) {
    const [data, setData] = useState([]);
    const [editingCells, setEditingCells] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState("");
    const [staticPage, setStaticPage] = useState(null);
    const [content, setContent] = useState("");
    const [url, setUrl] = useState("");

    const handleClose = () => {
        setShowModal(false);
        setPage("");
        setStaticPage(null);
        setContent("");
        setUrl("");
    };
    const handleShow = () => setShowModal(true);

    const handleView = (id) => {
        router.visit("/admin/sitemap/" + id + "/edit", {
            method: "get",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const requestData = {
            page: page,
            content: content,
            url: url,
            static_page: staticPage,
        };
        window.axios
            .post("/admin/sitemap", requestData)
            .then((response) => {
                if (response.data.check === true) {
                    toast.success(response.data.message);
                    setData(response.data.data);
                    handleClose();
                } else {
                    toast.warning(response.data.message);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            })
            .finally(() => setLoading(false));
    };

    const handleCellEditStart = (id, field, value) => {
        setEditingCells((prev) => ({ ...prev, [id + "-" + field]: value }));
    };

    const handleCellEditStop = (id, field, value) => {
        const originalValue = editingCells[id + "-" + field];
        if (originalValue !== value) {
            window.axios
                .put("/admin/sitemap/" + id, {
                    [field]: value,
                })
                .then((res) => {
                    if (res.data.check === true) {
                        toast.success(res.data.message);
                        setData(res.data.data);
                    } else {
                        toast.warning(res.data.message);
                    }
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                });
        } else {
            setEditingCells((prev) => {
                const newEditingCells = { ...prev };
                delete newEditingCells[id + "-" + field];
                return newEditingCells;
            });
            toast.info("Không có chỉnh sửa.");
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Xóa mục?",
            text: "Bạn chắc chắn muốn xóa mục này!",
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Có, xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                window.axios
                    .delete("/admin/sitemap/" + id)
                    .then((res) => {
                        if (res.data.check === true) {
                            toast.success(res.data.message);
                            setData(res.data.data);
                        } else {
                            toast.warning(res.data.message);
                        }
                    })
                    .catch((error) => {
                        toast.error(error.response.data.message);
                    });
            }
        });
    };

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "page",
            headerName: "Page",
            width: 180,
        },
        {
            field: "content",
            headerName: "Nội dung",
            width: 220,
        },
        {
            field: "url",
            headerName: "URL",
            width: 200,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 180,
            renderCell: (params) => (
                <FormControlLabel
                    control={
                        <Switch
                            checked={params.row.status === 1}
                            onClick={() =>
                                handleCellEditStop(
                                    params.row.id,
                                    "status",
                                    params.row.status === 1 ? 0 : 1
                                )
                            }
                        />
                    }
                    label={params.row.status ? "Hoạt động" : "Ẩn"}
                />
            ),
        },
        {
            field: "static_page",
            headerName: "Trạng thái",
            width: 200,
            renderCell: (params) => {
                let staticPage = params.row.static_page || "";

                return (
                    <FormControl fullWidth>
                        <Select
                            id="simple-select"
                            value={staticPage}
                            displayEmpty
                            onChange={(e) => {
                                handleCellEditStop(
                                    params.row.id,
                                    "static_page",
                                    e.target.value
                                );
                            }}
                        >
                            <MenuItem value={1}>Trang tĩnh</MenuItem>
                            <MenuItem value={2}>Trang link</MenuItem>
                        </Select>
                    </FormControl>
                );
            },
        },
        {
            field: "action",
            headerName: "Thao tác",
            width: 160,
            renderCell: (params) => (
                <>
                    <Button
                        type="button"
                        variant="outline-info"
                        title="Xem chi tiết sitemap"
                        onClick={() => handleView(params.row.id)}
                    >
                        <i className="bi bi-exclamation-circle" />
                    </Button>
                    <Button
                        className="ms-2"
                        type="button"
                        variant="outline-danger"
                        title="Xóa sản phẩm"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <i className="bi bi-trash-fill" />
                    </Button>
                </>
            ),
        },
    ]);

    const handleEditorBlur = (data) => {
        setContent(data);
    };
    useEffect(() => {
        setData(sitemap);
    }, [sitemap]);

    return (
        <>
            <Helmet>
                <title>Sitemap </title>
                <meta name="description" content="Sitemap " />
            </Helmet>
            <Layout>
                <section className="container">
                    <Row>
                        <BreadcrumbComponent props={crumbs}>
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleShow}
                            >
                                <i className="bi bi-plus-lg" />
                                <span className="ms-2">Thêm Sitemap Mới</span>
                            </Button>
                        </BreadcrumbComponent>
                        {/* Start Modal */}
                        <Modal
                            show={showModal}
                            onHide={handleClose}
                            size="lg"
                            centered
                        >
                            <Form onSubmit={handleSubmit}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Thêm Sitemap Mới</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row className="row-cols-2">
                                        <Col>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="page"
                                            >
                                                <Form.Label>
                                                    Tên Trang
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nhập tên trang"
                                                    value={page}
                                                    onChange={(e) =>
                                                        setPage(e.target.value)
                                                    }
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group
                                                className="mb-3"
                                                controlId="staticPage"
                                            >
                                                <Form.Label>
                                                    Trang tĩnh
                                                </Form.Label>
                                                <Form.Select
                                                    value={staticPage}
                                                    onChange={(e) =>
                                                        setStaticPage(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                >
                                                    <option value={null}>
                                                        Chọn loại trang{" "}
                                                    </option>
                                                    <option value={1}>
                                                        Trang tĩnh{" "}
                                                    </option>
                                                    <option value={2}>
                                                        Trang link{" "}
                                                    </option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="page"
                                    >
                                        <Form.Label>URL</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập url..."
                                            value={url}
                                            onChange={(e) =>
                                                setUrl(e.target.value)
                                            }
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="name"
                                    >
                                        <Form.Label>Nội dung chính</Form.Label>
                                        <CKEditor
                                            value={content}
                                            onBlur={handleEditorBlur}
                                        />
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={handleClose}
                                    >
                                        <i className="bi bi-box-arrow-right" />
                                        <span className="ms-2">Thoát ra</span>
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    size="sm"
                                                    animation="border"
                                                />
                                                <span className="ms-2">
                                                    Đang lưu...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-floppy-fill" />
                                                <span className="ms-2">
                                                    Lưu lại
                                                </span>
                                            </>
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                        {/* End Modal */}
                        <Col xs="12">
                            <Box sx={{ height: "70vh", width: "100%" }}>
                                <div className="text-start">
                                    <h4>Sitemap</h4>
                                </div>
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    slots={{
                                        toolbar: GridToolbar,
                                    }}
                                    slotProps={{
                                        toolbar: {
                                            showQuickFilter: true,
                                            quickFilterProps: {
                                                debounceMs: 500,
                                            },
                                        },
                                    }}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 20,
                                            },
                                        },
                                    }}
                                    onCellEditStop={(params, e) => {
                                        handleCellEditStop(
                                            params.row.id,
                                            params.field,
                                            e.target.value
                                        );
                                    }}
                                    onCellEditStart={(params, e) => {
                                        handleCellEditStart(
                                            params.row.id,
                                            params.field,
                                            e.target.value
                                        );
                                    }}
                                    pageSizeOptions={[20, 40, 60, 80, 100]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </Col>
                    </Row>
                </section>
            </Layout>
        </>
    );
}

export default Index;
