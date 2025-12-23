package com.carboncalc.controller;

import com.carboncalc.dto.AnalyticsReportDTO;
import com.carboncalc.entity.User;
import com.carboncalc.service.AnalyticsService;
import com.carboncalc.service.ReportExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final ReportExportService reportExportService;

    /**
     * Get weekly analytics report
     */
    @GetMapping("/weekly")
    public ResponseEntity<AnalyticsReportDTO> getWeeklyReport(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {

        AnalyticsReportDTO report = analyticsService.generateWeeklyReport(user, startDate);
        return ResponseEntity.ok(report);
    }

    /**
     * Get monthly analytics report
     */
    @GetMapping("/monthly")
    public ResponseEntity<AnalyticsReportDTO> getMonthlyReport(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {

        AnalyticsReportDTO report = analyticsService.generateMonthlyReport(user, startDate);
        return ResponseEntity.ok(report);
    }

    /**
     * Get yearly analytics report
     */
    @GetMapping("/yearly")
    public ResponseEntity<AnalyticsReportDTO> getYearlyReport(
            @AuthenticationPrincipal User user,
            @RequestParam int year) {

        AnalyticsReportDTO report = analyticsService.generateYearlyReport(user, year);
        return ResponseEntity.ok(report);
    }

    /**
     * Get emissions comparison
     */
    @GetMapping("/comparison")
    public ResponseEntity<Map<String, Object>> getEmissionsComparison(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Object> comparison = analyticsService.getEmissionsComparison(user, startDate, endDate);
        return ResponseEntity.ok(comparison);
    }

    /**
     * Export weekly report as PDF
     */
    @GetMapping("/export/weekly/pdf")
    public ResponseEntity<byte[]> exportWeeklyPDF(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) throws IOException {

        byte[] pdf = reportExportService.exportWeeklyReportPDF(user, startDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=weekly-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    /**
     * Export monthly report as PDF
     */
    @GetMapping("/export/monthly/pdf")
    public ResponseEntity<byte[]> exportMonthlyPDF(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) throws IOException {

        byte[] pdf = reportExportService.exportMonthlyReportPDF(user, startDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=monthly-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    /**
     * Export weekly report as CSV
     */
    @GetMapping("/export/weekly/csv")
    public ResponseEntity<String> exportWeeklyCSV(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) throws IOException {

        String csv = reportExportService.exportWeeklyReportCSV(user, startDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=weekly-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    /**
     * Export monthly report as CSV
     */
    @GetMapping("/export/monthly/csv")
    public ResponseEntity<String> exportMonthlyCSV(
            @AuthenticationPrincipal User user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) throws IOException {

        String csv = reportExportService.exportMonthlyReportCSV(user, startDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=monthly-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
