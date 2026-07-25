package com.carbontrack.controller;

import com.carbontrack.dto.BenchmarkDTO;
import com.carbontrack.service.BenchmarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/benchmarks")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Peer Benchmarking", description = "Endpoints for comparing carbon footprints against community averages and standings")
public class BenchmarkController {

    @Autowired
    private BenchmarkService benchmarkService;

    @GetMapping
    @Operation(summary = "Get Peer Benchmark Statistics", description = "Calculates user percentile standing and platform-wide category averages")
    public BenchmarkDTO getPeerBenchmark() {
        return benchmarkService.getPeerBenchmark();
    }
}
